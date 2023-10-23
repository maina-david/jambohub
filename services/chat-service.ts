import { db } from "@/lib/db"
import { ChannelType, MessageType, conversationFlowStatus } from '@prisma/client'
import axios from 'axios'

type WhatsAppAuthDetails = {
  phoneNumberId: string
  accessToken: string
}

export const handleAutomatedChat = async (chatMessageId: string) => {
  try {
    const chatMessage = await db.chatMessage.findFirst({
      where: {
        id: chatMessageId
      },
    })

    if (!chatMessage) {
      throw new Error("Chat message not found")
    }

    const chat = await db.chat.findFirst({
      where: {
        id: chatMessage.chatId
      },
      include: {
        Contact: true
      }
    })

    if (!chat) {
      throw new Error("Chat not found")
    }

    const automatedFlow = await db.channelToFlow.findFirst({
      where: {
        channelId: chat.channelId
      },
      include: {
        Flow: true
      }
    })

    if (!automatedFlow) {
      throw new Error("Channel not linked to an automated flow")
    }

    const conversationFlows = await db.conversationFlow.findMany({
      where: {
        flowId: automatedFlow.Flow.id
      }
    })

    if (!conversationFlows || conversationFlows.length === 0) {
      throw new Error("Conversation flows not found")
    }

    const conversationFlowLog = await db.conversationFlowLog.findMany({
      where: {
        flowId: automatedFlow.Flow.id,
        chatId: chatMessage.chatId
      }
    })

    if (!conversationFlowLog || conversationFlowLog.length === 0) {
      let currentConversationFlowId: string | null = null

      // Find the conversation flow with parentId as null
      for (const conversationFlow of conversationFlows) {
        if (conversationFlow.parentNodeId === null) {
          currentConversationFlowId = conversationFlow.id
          break
        }
      }

      if (currentConversationFlowId) {
        await db.conversationFlowLog.create({
          data: {
            flowId: automatedFlow.Flow.id,
            chatId: chatMessage.chatId,
            currentConversationFlowId: currentConversationFlowId
          }
        })

        let continueFlow: boolean = true

        while (continueFlow) {
          const currentConversationFlow = await db.conversationFlow.findFirst({
            where: {
              id: currentConversationFlowId
            }
          })

          if (!currentConversationFlow) {
            continueFlow = false
            throw new Error("Conversation flow not found")
          }
          if (currentConversationFlow.nodeType === 'sendText') {
            await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, currentConversationFlow.nodeData)
          } else if (currentConversationFlow.nodeType === 'sendTextWait') {
            await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, currentConversationFlow.nodeData)
            continueFlow = false
          } else if (currentConversationFlow.nodeType === 'sendTextResponse') {
            await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, currentConversationFlow.nodeData)
            continueFlow = false
          } else if (currentConversationFlow.nodeType === 'sendTextResponseWait') {
            await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, currentConversationFlow.nodeData)
            continueFlow = false
          } else {
            console.log("Unknown node type:", currentConversationFlow.nodeType)
            continueFlow = false
          }
        }
      } else {
        throw new Error("No conversation flow with parentId as null found")
      }
    } else {
      // Handle the case where conversationFlowLog already exists
      const lastEntry = conversationFlowLog[conversationFlowLog.length - 1]
      if (lastEntry && lastEntry.currentConversationFlowId) {
        const currentConversationFlow = await db.conversationFlow.findFirst({
          where: {
            id: lastEntry.currentConversationFlowId
          }
        })

        if (!currentConversationFlow) {
          throw new Error("Current Conversation flow not found")
        }

        const nextConversationFlows = await db.conversationFlow.findMany({
          where: {
            parentNodeId: currentConversationFlow.nodeId
          }
        })

        if (currentConversationFlow.nodeType === 'sendTextWait' ||
          currentConversationFlow.nodeType === 'sendTextResponseWait'
        ) {
          const matchingFlow = nextConversationFlows.find((flow) => flow.nodeOption === chatMessage.message)

          if (!matchingFlow) {
            // If failed to find the provided message as an option, send a message for invalid input
            sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, "Invalid input")
          } else {
            // Else send a message with the matching flow's nodeData
            sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, matchingFlow.nodeData)
          }
        } else {
          await db.conversationFlowLog.updateMany({
            where: {
              flowId: currentConversationFlow.id,
              chatId: chat.id,
              status: conversationFlowStatus.OPEN
            },
            data: {
              status: conversationFlowStatus.CLOSED
            }
          })
        }
      }
    }

  } catch (error) {
    console.log("ERROR_HANDLING_AUTOMATED_CHAT", error)
  }
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
        return response
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

export async function markWhatsAppMessageAsRead(channelId: string, messageId: string) {
  try {
    // Fetch the channel and ensure it's a WhatsApp channel
    const selectedChannel = await getActiveIntegratedChannel(channelId)

    if (selectedChannel.type === ChannelType.WHATSAPP) {
      const authDetails = selectedChannel.authDetails as WhatsAppAuthDetails

      if (!authDetails || !isValidWhatsAppAuthDetails(authDetails)) {
        throw new Error('Invalid or missing WhatsApp authDetails.')
      }

      // Mark the message as read using the provided messageId
      await markMessageAsRead(authDetails.phoneNumberId, authDetails.accessToken, messageId)

      console.log('WhatsApp message marked as "read".')
    }
  } catch (error) {
    console.error('Error marking WhatsApp message as "read":', error)
    throw new Error('Failed to mark WhatsApp message as "read".')
  }
}

async function markMessageAsRead(phoneNumberId: string, accessToken: string, messageId: string) {
  try {
    const response = await axios.put(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages/${messageId}`,
      {
        status: 'read'
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }
    )

    if (response.status === 204 || (response.data && Object.keys(response.data).length === 0)) {
      console.log('WhatsApp message marked as "read".')
    } else {
      console.error('WhatsApp API Error:', response.data)
      throw new Error('Failed to mark WhatsApp message as "read".')
    }
  } catch (error) {
    console.error('WhatsApp API Error:', error)
    throw new Error('Failed to mark WhatsApp message as "read".')
  }
}


