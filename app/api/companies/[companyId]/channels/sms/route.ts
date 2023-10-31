import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { MaximumPlanResourcesError, RequiresActivePlanError, RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { smsChannelSchema } from "@/lib/validations/channel"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
  }),
})

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
    const body = smsChannelSchema.parse(json)
    const authDetails = {
      "username": body.username,
      "apiKey": body.apiKey,
    }

    const channel = await db.channel.create({
      data: {
        name: body.name,
        companyId: params.companyId,
        identifier: body.shortCode,
        type: 'SMS',
        authDetails,
        integrated: true
      }
    })
    return new Response(JSON.stringify(channel), { status: 201 })
  } catch (error) {
    console.log('[SMS_CHANNELS_POST]', error)
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
      return new Response("Exceeded Maximum Channel Limit", { status: 403 }) // Forbidden
    }

    return new Response(null, { status: 500 })
  }
}
