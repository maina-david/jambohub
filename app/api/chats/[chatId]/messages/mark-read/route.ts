import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const routeContextSchema = z.object({
  params: z.object({
    chatId: z.string(),
  }),
})

const markMessagesAsReadSchema = z.array(z.string())

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    const messageIds = markMessagesAsReadSchema.parse(await req.json())

    // Update each message in the array
    for (const messageId of messageIds) {
      await db.chatMessage.updateMany({
        where: {
          chatId: params.chatId,
          id: messageId,
        },
        data: {
          internalStatus: 'read'
        },
      })
    }

    return new Response(null, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
