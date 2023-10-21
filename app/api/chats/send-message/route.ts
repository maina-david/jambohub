import { getServerSession } from "next-auth/next"
import * as z from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendMessage } from "@/services/chat-service"
import {
  MessageCategory,
  MessageDirection,
  MessageType,
  ChatMessage,
} from "@prisma/client"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
  }),
})

const sendMessageSchema = z.object({
  chatId: z.string().min(1),
  messageType: z.enum(["TEXT"]),
  message: z.string().min(1),
})

export async function POST(req: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = sendMessageSchema.parse(json)

    const chat = await db.chat.findFirst({
      where: {
        id: body.chatId,
      },
      include: {
        channel: true,
        Contact: true,
      },
    })

    if (!chat) {
      return new Response("Unable to find chat", { status: 404 })
    }

    // Create a chat message with initial internalStatus "pending"
    const message: ChatMessage = await db.chatMessage.create({
      data: {
        chatId: chat.id,
        userId: session.user.id,
        message: body.message,
        direction: MessageDirection.OUTGOING,
        type: MessageType.TEXT,
        category: MessageCategory.INTERACTIVE,
        internalStatus: "pending",
      },
    })

    try {
      // Attempt to send the message
      const sentMessageId = await sendMessage(chat.channelId, body.messageType, chat.Contact.identifier, body.message)

      // If the message is successfully sent, update the internalStatus to "sent"
      const sentMessage = await db.chatMessage.update({
        where: {
          id: message.id,
        },
        data: {
          externalRef: sentMessageId,
          internalStatus: "sent",
        },
      })

      // Return the sent message with status 200 (OK)
      return new Response(JSON.stringify(sentMessage), { status: 200 })
    } catch (error) {
      // If there is an error in sending the message, you can still return the message
      // with internalStatus set to "failed" and status 200 (OK) to ensure the UI receives the message.
      const failedMessage = await db.chatMessage.update({
        where: {
          id: message.id,
        },
        data: {
          internalStatus: "failed",
        },
      })

      console.error("[SEND_MESSAGE]", error)

      // Return the message with status 200 (OK)
      return new Response(JSON.stringify(failedMessage), { status: 200 })
    }
  } catch (error) {
    console.log("[SEND_MESSAGE]", error)

    // If there's an error at the server level, you can return an error response with status 500 (Internal Server Error).
    return new Response("Internal Server Error", { status: 500 })
  }
}
