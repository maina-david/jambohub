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
  ChatCategory,
} from "@prisma/client"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
  }),
})

const sendMessageSchema = z.object({
  chatId: z.string().min(1),
  contactId: z.string().min(1),
  channelId: z.string().min(1),
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

    let chatId: string

    const channel = await db.channel.findFirst({
      where: {
        id: body.channelId
      }
    })

    if (!channel) {
      return new Response("Unable to find selected channel", { status: 422 })
    }

    const contact = await db.contact.findFirst({
      where: {
        id: body.contactId
      }
    })
    if (!contact) {
      return new Response("Unable to find selected contact", { status: 422 })
    }

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
      const newChat = await db.chat.create({
        data: {
          category: ChatCategory.INTERACTIVE,
          channelId: channel.id,
          companyId: channel.companyId,
          contactId: contact.id,
        },
        include: {
          channel: true,
          Contact: true,
        },
      })

      chatId = newChat.id
    } else {
      chatId = chat.id
    }

    const message: ChatMessage = await db.chatMessage.create({
      data: {
        chatId: chatId,
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
      const sentMessageId = await sendMessage(channel.id, body.messageType, contact.identifier, body.message)

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

      console.error("[SEND_MESSAGE_API]", error)

      // Return the message with status 200 (OK)
      return new Response(JSON.stringify(failedMessage), { status: 200 })
    }
  } catch (error) {
    console.log("[SEND_MESSAGE]", error)

    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
