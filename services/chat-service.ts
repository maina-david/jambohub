import { db } from "@/lib/db"
import { ChannelType, MessageType } from '@prisma/client'
import {
  WhatsAppAuthDetails,
  isValidWhatsAppAuthDetails,
  markWhatsAppMessageAsRead,
  sendWhatsAppTextMessage
} from "@/services/whatsapp-service"

export async function sendMessage(
  channelId: string,
  messageType: MessageType,
  recipient: string,
  messageContent: string | null
) {
  try {
    if (messageContent) {
      // Fetch the channel and ensure it's active, integrated, and has valid authDetails
      const selectedChannel = await getActiveIntegratedChannel(channelId)

      if (selectedChannel.type === ChannelType.WHATSAPP) {
        const authDetails = selectedChannel.authDetails as WhatsAppAuthDetails

        if (!authDetails || !isValidWhatsAppAuthDetails(authDetails)) {
          throw new Error('Invalid or missing WhatsApp authDetails.')
        }

        if (messageType === MessageType.TEXT) {
          const response = await sendWhatsAppTextMessage(authDetails.phoneNumberId, authDetails.accessToken, recipient, messageContent)
          return response
        }
      }
    } else {
      throw new Error('null message content')
    }
  } catch (error) {
    console.error('Error sending message:', error)
    throw new Error('Message sending failed')
  }
}

export async function markMessageAsRead(channelId: string, messageId: string) {
  try {
    // Fetch the channel and ensure it's a WhatsApp channel
    const selectedChannel = await getActiveIntegratedChannel(channelId)

    if (selectedChannel.type === ChannelType.WHATSAPP) {
      const authDetails = selectedChannel.authDetails as WhatsAppAuthDetails

      if (!authDetails || !isValidWhatsAppAuthDetails(authDetails)) {
        throw new Error('Invalid or missing WhatsApp authDetails.')
      }

      // Mark the message as read using the provided messageId
      await markWhatsAppMessageAsRead(authDetails.phoneNumberId, authDetails.accessToken, messageId)

      console.log('WhatsApp message marked as "read".')
    }
  } catch (error) {
    console.error('Error marking WhatsApp message as "read":', error)
    throw new Error('Failed to mark WhatsApp message as "read".')
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



