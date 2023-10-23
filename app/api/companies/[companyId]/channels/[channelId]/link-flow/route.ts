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

const channelLinkSchema = z.object({
  flowId: z.string().min(1),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this channel.
    if (!(await verifyCurrentUserHasAccessToChannel(params.channelId))) {
      return new Response(null, { status: 403 })
    }

    if (!(await verifyChannelBelongsToCompany(params.companyId, params.channelId))) {
      return new Response(null, { status: 422 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = channelLinkSchema.parse(json)

    // Check if a record with the given channelId exists.
    const existingChannelToFlow = await db.channelToFlow.findFirst({
      where: {
        channelId: params.channelId,
      },
    })

    if (existingChannelToFlow) {
      // Update the existing record with the new flowId.
      await db.channelToFlow.update({
        where: {
          id: existingChannelToFlow.id
        },
        data: {
          flowId: body.flowId
        },
      })
    } else {
      // Create a new record.
      await db.channelToFlow.create({
        data: {
          channelId: params.channelId,
          flowId: body.flowId,
        },
      })
    }

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToChannel(channelId: string) {
  const session = await getServerSession(authOptions)
  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
    include: { company: true },
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
      companyId: companyId,
    },
  })

  if (!channel) {
    return false
  }

  return true
}
