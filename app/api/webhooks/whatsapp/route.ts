import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ChannelType, ChatType, MessageDirection, MessageType } from "@prisma/client"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const hubChallenge = searchParams.get('hub.challenge')
  if (hubChallenge) {
    return new Response(hubChallenge, { status: 200 })
  }
  return new Response(null, { status: 200 })
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.text()
    const webhookData = JSON.parse(requestBody)

    // Check if the webhook object is WhatsApp Business Account
    if (webhookData.object === 'whatsapp_business_account') {
      // Extract the message data from the webhook
      const messageData = webhookData.entry[0].changes[0].value
      // Fetch the Channel based on the phone number id
      const phoneNumberId = messageData.metadata.phone_number_id
      const channel = await fetchChannelDetails(phoneNumberId)

      console.log('Message Data: ', messageData)
      if (channel) {
        // Save or update the contact
        const contactData = {
          companyId: channel.companyId,
          channel: ChannelType.WHATSAPP,
          identifier: messageData.contacts[0].wa_id,
          alias: messageData.contacts[0].profile.name
        }
        const contact = await saveOrUpdateContact(contactData)

        // Create a new Chat record to represent the conversation
        const newChat = await db.chat.create({
          data: {
            type: ChatType.INTERACTIVE,
            channelId: channel.id,
            companyId: channel.companyId,
            contactId: contact.id,
            externalRef: messageData.id,
          },
        })

        // Create a new ChatMessage record for the incoming message
        const newChatMessage = await db.chatMessage.create({
          data: {
            chatId: newChat.id,
            externalRef: messageData.id,
            direction: MessageDirection.INCOMING,
            type: MessageType.INTERACTIVE,
            message: messageData.messages[0].text.body,
            timestamp: new Date(messageData.messages[0].timestamp),
          },
        })
      }

      // Send a response to acknowledge the receipt and processing of the webhook data
      return new Response('Webhook data received and processed.', { status: 200 })
    }

    // If the webhook data does not match the expected structure, return a generic response
    return new Response('Invalid webhook data', { status: 400 })
  } catch (error) {
    // Log the error for debugging and error tracking
    console.error('Error handling webhook data:', error)

    // Send a response to indicate an error occurred
    return new Response('Error handling webhook data', { status: 500 })
  }
}

// Function to fetch channel details
async function fetchChannelDetails(phoneNumberId: string) {
  try {
    // Use db to find the channel that matches the criteria
    const whatsappChannel = await db.channel.findFirst({
      where: {
        type: 'WHATSAPP',
        identifier: phoneNumberId,
      },
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
      where: { identifier: data.identifier },
    })

    if (existingContact) {
      // Contact with the given identifier already exists, update it
      const updatedContact = await db.contact.update({
        where: { id: existingContact.id },
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

