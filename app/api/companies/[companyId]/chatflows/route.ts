import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { MaximumPlanResourcesError, RequiresActivePlanError, RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"

const chatflowCreateSchema = z.object({
  name: z.string(),
  description: z.string()
})

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
  }),
})

export async function GET(context: z.infer<typeof routeContextSchema>) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    const companies = await db.chatflow.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        published: true,
        createdAt: true,
      },
      where: {
        companyId: params.companyId,
      },
    })

    return new Response(JSON.stringify(companies))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request,
  context: z.infer<typeof routeContextSchema>) {
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

    const count = await db.chatflow.count({
      where: {
        companyId: params.companyId,
      },
    })

    if (count >= subscriptionPlan.maxChatflows) {
      if (subscriptionPlan.plan === "FREE") {
        throw new RequiresProPlanError()
      } else if (subscriptionPlan.plan === "PRO") {
        throw new MaximumPlanResourcesError()
      }
    }

    const json = await req.json()
    const body = chatflowCreateSchema.parse(json)

    const chatflow = await db.chatflow.create({
      data: {
        name: body.name,
        description: body.description,
        companyId: params.companyId,
      },
      select: {
        id: true,
      },
    })

    if (subscriptionPlan.plan === "FREE") {
      const defaultTeam = await db.team.create({
        data: {
          companyId: chatflow.id,
          name: 'Default'
        }
      })

      await db.userTeam.create({
        data: {
          userId: user.id,
          teamId: defaultTeam.id
        }
      })
    }

    return new Response(JSON.stringify(chatflow), { status: 201 })

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
      return new Response("Exceeded Maximum ChatFlow Limit", { status: 403 })
    }

    return new Response(null, { status: 500 })
  }
}

