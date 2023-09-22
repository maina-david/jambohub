import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { MaximumPlanResourcesError, RequiresActivePlanError, RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"

const teamCreateSchema = z.object({
  name: z.string(),
  companyId: z.string()
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()

    const companyId = json.companyId

    const teams = await db.team.findMany({
      select: {
        id: true,
        name: true,
        status: true
      },
      where: {
        companyId: companyId
      },
    })

    return new Response(JSON.stringify(teams))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    if (!subscriptionPlan) {
      throw new RequiresActivePlanError()
    }

    const json = await req.json()
    const body = teamCreateSchema.parse(json)

    const companyId = body.companyId

    const count = await db.team.count({
      where: {
        companyId: companyId,
      },
    })

    if (count >= subscriptionPlan.maxUsers) {
      if (subscriptionPlan.plan === "FREE") {
        throw new RequiresProPlanError()
      } else if (subscriptionPlan.plan === "PRO") {
        throw new MaximumPlanResourcesError()
      }
    }

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

    if (error instanceof MaximumPlanResourcesError) {
      return new Response("Exceeded Maximum team Limit", { status: 403 })
    }

    return new Response(null, { status: 500 })
  }
}

