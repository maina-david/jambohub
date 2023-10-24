import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import {
  ChannelType,
  ChatCategory,
  MessageDirection,
  MessageCategory,
  MessageType,
  Chat,
  ChatMessage
} from "@prisma/client"
import { pusher } from "@/lib/pusher"
import { handleAutomatedChat } from "@/services/flow-service"
import { sendMessage } from "@/services/chat-service"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const hubChallenge = searchParams.get('hub.challenge')
  if (hubChallenge) {
    return new Response(hubChallenge, { status: 200 })
  }
  return new Response(null, { status: 200 })
}

export async function POST(request: NextRequest) {
  const requestBody = await request.text()
  const webhookData = JSON.parse(requestBody)

  // Validate  Webhook
  if (webhookData &&
    webhookData.object === 'whatsapp_business_account' &&
    webhookData.entry &&
    webhookData.entry.length > 0 &&
    webhookData.entry[0].changes &&
    webhookData.entry[0].changes.length > 0 &&
    webhookData.entry[0].changes[0].value) {
    // Extract the message data from the webhook
    const messageData = webhookData.entry[0].changes[0].value
    // Fetch the Channel based on the phone number
    const phoneNumber = messageData.metadata.display_phone_number
    const channel = await fetchChannelDetails(phoneNumber)
    const identifier = messageData.contacts[0].wa_id

    if (channel && messageData) {
      // Check if the message type is valid
      const messageType = messageData.messages[0].type
      if (isValidMessageType(messageType)) {
        // Save or update the contact
        const contactData = {
          companyId: channel.companyId,
          channel: ChannelType.WHATSAPP,
          identifier,
          alias: messageData.contacts[0].profile.name,
        }
        const contact = await saveOrUpdateContact(contactData)

        // Check if a chat with the same contact ID exists
        const existingChat = await findChatByContactId(contact.id)

        let chat: Chat
        let chatMessage: ChatMessage

        if (existingChat) {
          // Add a new message to the existing chat
          const newChatMessage = await db.chatMessage.create({
            data: {
              chatId: existingChat.id,
              externalRef: messageData.messages[0].id,
              direction: MessageDirection.INCOMING,
              category: existingChat.category === ChatCategory.AUTOMATED ? ChatCategory.AUTOMATED : ChatCategory.INTERACTIVE,
              type: getMessageType(messageType),
              message: messageData.messages[0].text.body,
              internalStatus: 'unread'
            },
          })
          chat = existingChat
          chatMessage = newChatMessage
        } else {
          // Create a new Chat record to represent the conversation
          const newChat = await db.chat.create({
            data: {
              category: channel.ChannelToFlow ? ChatCategory.AUTOMATED : ChatCategory.INTERACTIVE,
              channelId: channel.id,
              companyId: channel.companyId,
              contactId: contact.id,
            },
            include: {
              Contact: true,
              chatMessages: true
            }
          })

          // Create a new ChatMessage record for the incoming message
          const newChatMessage = await db.chatMessage.create({
            data: {
              chatId: newChat.id,
              externalRef: messageData.messages[0].id,
              direction: MessageDirection.INCOMING,
              category: newChat.category === ChatCategory.AUTOMATED ? MessageCategory.AUTOMATED : ChatCategory.INTERACTIVE,
              type: getMessageType(messageType),
              message: messageData.messages[0].text.body,
              internalStatus: 'unread'
            },
          })
          chat = newChat
          chatMessage = newChatMessage
        }

        if (chat.category === 'AUTOMATED' && chatMessage.category === 'AUTOMATED') {
          await handleAutomatedChat(chatMessage.id)
        }

        if (chat.category === 'INTERACTIVE' && chatMessage.category === 'INTERACTIVE') {
          await pusher.trigger("chat", "new-chat-message", {
            chat,
            chatMessage
          })
        }
      } else {
        sendMessage(channel.id, 'TEXT', identifier, `${messageType.charAt(0).toUpperCase() + messageType.slice(1).toLowerCase()} messages are not supported.`)
      }
    }

    // Return 200
    return new Response(null, { status: 200 })
  }
}

// Function to fetch channel details
async function fetchChannelDetails(phoneNumber: string) {
  try {
    // Use db to find the channel that matches the criteria
    const whatsappChannel = await db.channel.findFirst({
      where: {
        type: ChannelType.WHATSAPP,
        identifier: phoneNumber,
      },
      include: {
        ChannelToFlow: true
      }
    })

    // Check if a matching channel was found
    if (whatsappChannel) {
      return whatsappChannel
    } else {
      // Handle the case where no matching channel was found
      return null
    }
  } catch (error) {
    // Log the error for debugging and error tracking
    console.error('Error fetching channel details:', error)

    return null
  }
}

// Function to save or update a contact
async function saveOrUpdateContact(data: { identifier: string, companyId: string, channel: ChannelType, alias: string }) {
  try {
    const existingContact = await db.contact.findFirst({
      where: {
        identifier: data.identifier,
        companyId: data.companyId
      },
    })

    if (existingContact) {
      // Contact with the given identifier already exists, update it
      const updatedContact = await db.contact.update({
        where: {
          id: existingContact.id
        },
        data,
      })
      return updatedContact
    } else {
      // Contact with the given identifier does not exist, create a new one
      const newContact = await db.contact.create({ data })
      return newContact
    }
  } catch (error) {
    console.error('Error saving/updating contact:', error)
    throw error
  }
}

// Function to find a chat by contact ID
async function findChatByContactId(contactId: string) {
  const existingChat = await db.chat.findFirst({
    where: {
      contactId,
    },
    include: {
      Contact: true,
      chatMessages: true
    }
  })
  return existingChat
}

// Function to validate if the message type is valid
function isValidMessageType(messageType: string) {
  const validTypes = [
    "text",
    // "media",
    // "contact",
    // "location",
    // "interactive",
    // "template"
  ]
  return validTypes.includes(messageType)
}

// Function to map the message type to the MessageType enum
function getMessageType(messageType: string) {
  switch (messageType) {
    case "text":
      return MessageType.TEXT
    case "media":
      return MessageType.MEDIA
    case "contact":
      return MessageType.CONTACT
    case "location":
      return MessageType.LOCATION
    case "interactive":
      return MessageType.INTERACTIVE
    case "template":
      return MessageType.TEMPLATE
    default:
      return MessageType.TEXT
  }
}
