import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { MaximumPlanResourcesError, RequiresActivePlanError, RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"

const channelCreateSchema = z.object({
  channel: z.enum([
    'WHATSAPP',
    'TWITTER',
    'FACEBOOK',
    'TIKTOK',
    'SMS'
  ]),
  name: z.string().min(1),
  description: z.string().optional()
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

    const channels = await db.channel.findMany({
      where: {
        companyId: params.companyId
      }
    })
    return new Response(JSON.stringify(channels))
  } catch (error) {
    console.log('[CHANNELS_GET]', error);
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

    const channelCount = await db.channel.count({
      where: {
        companyId: params.companyId
      }
    })

    if (channelCount >= subscriptionPlan.maxChannels) {
      if (subscriptionPlan.plan === "FREE") {
        throw new RequiresProPlanError()
      } else if (subscriptionPlan.plan === "PRO") {
        throw new MaximumPlanResourcesError()
      }
    }

    const json = await req.json()
    const body = channelCreateSchema.parse(json)

    const channel = await db.channel.create({
      data: {
        name: body.name,
        description: body.description,
        companyId: params.companyId,
        type: body.channel,
      }
    })
    return new Response(JSON.stringify(channel))
  } catch (error) {
    console.log('[CHANNELS_POST]', error);
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
      return new Response("Exceeded Maximum Channel Limit", { status: 403 })
    }

    return new Response(null, { status: 500 })
  }
}
