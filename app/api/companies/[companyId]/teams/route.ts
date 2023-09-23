import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { MaximumPlanResourcesError, RequiresActivePlanError, RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
  }),
})

const teamCreateSchema = z.object({
  name: z.string()
})

export async function GET(context: z.infer<typeof routeContextSchema>) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    const teams = await db.team.findMany({
      select: {
        id: true,
        name: true,
        status: true
      },
      where: {
        companyId: params.companyId
      },
    })

    return new Response(JSON.stringify(teams))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    const { user } = session
    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    if (!subscriptionPlan) {
      throw new RequiresActivePlanError()
    }

    const companyId = params.companyId

    const count = await db.team.count({
      where: {
        companyId: companyId,
      },
    })

    if (count >= subscriptionPlan.maxUsers || subscriptionPlan.plan === "FREE") {
      throw new RequiresProPlanError()
    }
    
    const json = await req.json()
    const body = teamCreateSchema.parse(json)

    const team = await db.team.create({
      data: {
        name: body.name,
        companyId: companyId,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(team))

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    if (error instanceof RequiresProPlanError) {
      return new Response("Requires Pro Plan", { status: 402 })
    }

    if (error instanceof RequiresActivePlanError) {
      return new Response("Requires Active Plan", { status: 403 })
    }

    return new Response(null, { status: 500 })
  }
}

