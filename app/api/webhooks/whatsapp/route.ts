import { NextRequest } from "next/server"
import { db } from "@/lib/db"

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
      // Fetch the Channel based on the WhatsApp ID (phoneNumberId)
      const phoneNumberId = messageData.contacts[0].wa_id
      const channel = await fetchChannelDetails(phoneNumberId)

      if (channel) {
        // Create a new Chat record to represent the conversation
        const newChat = await db.chat.create({
          data: {
            type: 'INTERACTIVE',
            channelId: channel.id,
            companyId: channel.companyId,
            contactId: messageData.contacts[0].wa_id,
            externalRef: messageData.id,
          },
        })

        // Create a new ChatMessage record for the incoming message
        const newChatMessage = await db.chatMessage.create({
          data: {
            chatId: newChat.id,
            externalRef: messageData.id,
            direction: 'INCOMING',
            type: 'INTERACTIVE',
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
    console.error('Error handling webhook data:', error)
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
    console.error('Error fetching channel details:', error)
    return null
  }
}
