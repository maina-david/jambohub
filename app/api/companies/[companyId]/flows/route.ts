import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { MaximumPlanResourcesError, RequiresActivePlanError, RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"

const flowCreateSchema = z.object({
  name: z.string().min(1),
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

    const flows = await db.flow.findMany({
      where: {
        companyId: params.companyId
      }
    })
    return new Response(JSON.stringify(flows))
  } catch (error) {
    console.log('[FLOWS_GET]', error)
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

    const flowCount = await db.flow.count({
      where: {
        companyId: params.companyId
      }
    })

    if (flowCount >= subscriptionPlan.maxFlows) {
      if (subscriptionPlan.plan === "FREE") {
        throw new RequiresProPlanError()
      } else if (subscriptionPlan.plan === "PRO") {
        throw new MaximumPlanResourcesError()
      }
    }

    const json = await req.json()
    const body = flowCreateSchema.parse(json)

    const flow = await db.flow.create({
      data: {
        name: body.name,
        companyId: params.companyId,
      }
    })
    return new Response(JSON.stringify(flow), { status: 201 })
  } catch (error) {
    console.log('[FLOWS_POST]', error)
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
      return new Response("Exceeded Maximum Flow Limit", { status: 403 }) // Forbidden
    }

    return new Response(null, { status: 500 })
  }
}
