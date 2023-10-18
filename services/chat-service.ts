import { db } from "@/lib/db"
import { ChannelType, MessageType } from '@prisma/client'
import axios from 'axios'

type WhatsAppAuthDetails = {
  phoneNumberId: string
  accessToken: string
}

export async function sendMessage(
  channelId: string,
  messageType: MessageType,
  recipient: string,
  messageContent: string
) {
  try {
    // Fetch the channel and ensure it's active, integrated, and has valid authDetails
    const selectedChannel = await getActiveIntegratedChannel(channelId)

    if (selectedChannel.type === ChannelType.WHATSAPP) {
      const authDetails = selectedChannel.authDetails as WhatsAppAuthDetails

      if (!authDetails || !isValidWhatsAppAuthDetails(authDetails)) {
        throw new Error('Invalid or missing WhatsApp authDetails.')
      }

      if (messageType === MessageType.TEXT) {
        const response = await sendWhatsAppTextMessage(authDetails.phoneNumberId, authDetails.accessToken, recipient, messageContent)
        console.log('WhatsApp Text Message Sent:', response)
      }
    }
  } catch (error) {
    console.error('Error sending message:', error)
    throw new Error('Message sending failed')
  }
}

async function getActiveIntegratedChannel(channelId: string) {
  const selectedChannel = await db.channel.findUnique({
    where: { id: channelId },
    select: { status: true, type: true, identifier: true, authDetails: true, integrated: true },
  })

  if (
    !selectedChannel ||
    !selectedChannel.status ||
    !selectedChannel.integrated ||
    !selectedChannel.identifier ||
    !selectedChannel.authDetails
  ) {
    throw new Error('Channel not found or not active/integrated.')
  }

  return selectedChannel
}

function isValidWhatsAppAuthDetails(authDetails: WhatsAppAuthDetails): boolean {
  return !!authDetails.phoneNumberId && !!authDetails.accessToken
}

async function sendWhatsAppTextMessage(phoneNumberId: string, accessToken: string, recipient: string, messageContent: string) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'text',
        text: {
          preview_url: false,
          body: messageContent,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (response.data.messages && response.data.messages[0] && response.data.messages[0].id) {
      console.log('WhatsApp Text Message Sent:', response.data.messages[0].id)
      return response.data.messages[0].id
    } else {
      console.error('WhatsApp API Error:', response.data)
      throw new Error('WhatsApp message not sent. Check the response for details.')
    }
  } catch (error) {
    console.error('WhatsApp API Error:', error)
    throw new Error('Failed to send WhatsApp message.')
  }
}

