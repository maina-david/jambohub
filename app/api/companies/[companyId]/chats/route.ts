import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

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

    const chats = await db.chat.findMany({
      where: {
        companyId: params.companyId,
        category: 'INTERACTIVE'
      },
      include: {
        channel: true,
        Contact: true,
        chatMessages: {
          where: {
            category: 'INTERACTIVE'
          }
        },
      }
    })

    // Calculate the number of unread messages for each chat
    const chatsWithUnreadCounts = chats.map((chat) => {
      const unreadCount = chat.chatMessages.filter(
        (message) => message.internalStatus === "unread"
      ).length

      return {
        ...chat,
        unreadMessageCount: unreadCount,
      }
    })

    return new Response(JSON.stringify(chatsWithUnreadCounts))
  } catch (error) {
    console.log('[CHATS_GET]', error)
    return new Response(null, { status: 500 })
  }
}
