import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { MaximumPlanResourcesError, RequiresActivePlanError, RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"

const customerCreateSchema = z.object({
  name: z.string(),
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

    const customers = await db.customer.findMany({
      where: {
        companyId: params.companyId
      },
    })

    return new Response(JSON.stringify(customers))
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
    const body = customerCreateSchema.parse(json)

    // const customer = await db.customer.create({
    //   data: {
    //     name: body.name,
    //     ownerId: user.id,
    //   },
    //   select: {
    //     id: true,
    //   },
    // })

    // return new Response(JSON.stringify(customer), { status: 201 })

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

