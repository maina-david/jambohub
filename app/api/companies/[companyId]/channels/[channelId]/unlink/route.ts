import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
    channelId: z.string(),
  }),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this channel.
    if (!(await verifyCurrentUserHasAccessTochannel(params.channelId))) {
      return new Response(null, { status: 403 })
    }

    if (!(await verifyChannelBelongsToCompany(params.companyId, params.channelId))) {
      return new Response(null, { status: 422 })
    }

    // Update the channel.
    await db.channel.update({
      where: {
        id: params.channelId,
      },
      data: {
        identifier: null,
        authDetails: undefined,
        integrated: false
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessTochannel(channelId: string) {
  const session = await getServerSession(authOptions)
  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
    include: { company: true }
  })

  if (!channel || channel.company.ownerId !== session?.user.id) {
    return false
  }

  return true

}

async function verifyChannelBelongsToCompany(companyId: string, channelId: string) {
  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
      companyId: companyId
    }
  })

  if (!channel) {
    return false
  }

  return true

}
