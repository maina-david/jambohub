import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { MaximumPlanResourcesError, RequiresActivePlanError, RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"

const teamCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(3).max(128)
})

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
  }),
})

export async function GET(req: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    const teams = await db.team.findMany({
      where: {
        companyId: params.companyId
      }
    })
    return new Response(JSON.stringify(teams))
  } catch (error) {
    console.log('[TEAMS_GET]', error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 }) // Unprocessable Entity
    }
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    const { user } = session
    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    if (!subscriptionPlan) {
      throw new RequiresActivePlanError()
    }

    const teamCount = await db.team.count({
      where: {
        companyId: params.companyId
      }
    })

    if (teamCount >= subscriptionPlan.maxTeams) {
      if (subscriptionPlan.plan === "FREE") {
        throw new RequiresProPlanError()
      } else if (subscriptionPlan.plan === "PRO") {
        throw new MaximumPlanResourcesError()
      }
    }

    const json = await req.json()
    const body = teamCreateSchema.parse(json)

    const team = await db.team.create({
      data: {
        name: body.name,
        description: body.description,
        companyId: params.companyId
      }
    })
    return new Response(JSON.stringify(team), { status: 201 })
  } catch (error) {
    console.log('[TEAMS_POST]', error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 }) // Unprocessable Entity
    }

    if (error instanceof RequiresProPlanError) {
      return new Response("Requires Pro Plan", { status: 402 }) // Payment Required
    }

    if (error instanceof RequiresActivePlanError) {
      return new Response("Requires Active Plan", { status: 403 }) // Forbidden
    }

    if (error instanceof MaximumPlanResourcesError) {
      return new Response("Exceeded Maximum Team Limit", { status: 403 }) // Forbidden
    }

    return new Response(null, { status: 500 })
  }
}
