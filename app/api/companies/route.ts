import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { MaximumPlanResourcesError, RequiresActivePlanError, RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"

const companyCreateSchema = z.object({
  name: z.string(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const companies = await db.company.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
      },
      where: {
        ownerId: user.id,
      },
    })

    return new Response(JSON.stringify(companies))
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

    const count = await db.company.count({
      where: {
        ownerId: user.id,
      },
    })

    if (count >= subscriptionPlan.maxCompanies) {
      if (subscriptionPlan.plan === "FREE") {
        throw new RequiresProPlanError()
      } else if (subscriptionPlan.plan === "PRO") {
        throw new MaximumPlanResourcesError()
      }
    }

    const json = await req.json()
    const body = companyCreateSchema.parse(json)

    const company = await db.company.create({
      data: {
        name: body.name,
        ownerId: user.id,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(company), { status: 201 })

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
      return new Response("Exceeded Maximum Company Limit", { status: 403 })
    }

    return new Response(null, { status: 500 })
  }
}

