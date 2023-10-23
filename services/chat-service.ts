import { db } from "@/lib/db"
import { ChannelType, ConversationFlow, MessageType, conversationFlowStatus } from '@prisma/client'
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
        chatId: chatMessage.chatId,
        status: conversationFlowStatus.OPEN
      }
    })

    if (!conversationFlowLog || conversationFlowLog.length === 0) {
      let currentParentNodeId: string | null = null

      let continueFlow: boolean = true

      while (continueFlow) {
        const currentConversationFlow = await db.conversationFlow.findFirst({
          where: {
            parentNodeId: currentParentNodeId,
            flowId: automatedFlow.Flow.id
          }
        })

        if (!currentConversationFlow) {
          continueFlow = false
          throw new Error("Conversation flow not found")
        }

        if (currentConversationFlow.nodeType === 'sendText' || currentConversationFlow.nodeType === 'sendTextResponse') {
          await db.conversationFlowLog.create({
            data: {
              flowId: automatedFlow.Flow.id,
              chatId: chatMessage.chatId,
              currentConversationFlowId: currentConversationFlow.id
            }
          })
          await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, currentConversationFlow.nodeData)
          const nextChildFlow = await db.conversationFlow.findMany({
            where: {
              parentNodeId: currentConversationFlow.nodeId,
              flowId: automatedFlow.Flow.id
            }
          })
          if (!nextChildFlow || nextChildFlow.length === 0) {
            await db.conversationFlowLog.updateMany({
              where: {
                flowId: automatedFlow.Flow.id,
                chatId: chat.id,
                status: conversationFlowStatus.CLOSED
              },
              data: {
                status: conversationFlowStatus.CLOSED
              }
            })
            continueFlow = false
          }
        } else if (currentConversationFlow.nodeType === 'sendTextWait') {
          await db.conversationFlowLog.create({
            data: {
              flowId: automatedFlow.Flow.id,
              chatId: chatMessage.chatId,
              currentConversationFlowId: currentConversationFlow.id
            }
          })
          await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, currentConversationFlow.nodeData)
          continueFlow = false
        } else if (currentConversationFlow.nodeType === 'sendTextResponseWait') {
          await db.conversationFlowLog.create({
            data: {
              flowId: automatedFlow.Flow.id,
              chatId: chatMessage.chatId,
              currentConversationFlowId: currentConversationFlow.id
            }
          })
          await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, currentConversationFlow.nodeData)
          continueFlow = false
        } else {
          console.log("Unknown node type:", currentConversationFlow.nodeType)
          continueFlow = false
        }
        currentParentNodeId = currentConversationFlow.nodeId
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

            if (matchingFlow.nodeType === 'sendText' || matchingFlow.nodeType === 'sendTextResponse') {

              sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, matchingFlow.nodeData)

              let currentParentNodeId: string = matchingFlow.nodeId

              let continueFlow: boolean = true

              while (continueFlow) {
                const nextConversationFlow = await db.conversationFlow.findFirst({
                  where: {
                    parentNodeId: currentParentNodeId,
                    flowId: automatedFlow.Flow.id
                  }
                })

                if (nextConversationFlow) {
                  if (nextConversationFlow.nodeType === 'sendText') {
                    await db.conversationFlowLog.create({
                      data: {
                        flowId: automatedFlow.Flow.id,
                        chatId: chatMessage.chatId,
                        currentConversationFlowId: nextConversationFlow.id
                      }
                    })
                    await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, nextConversationFlow.nodeData)
                  } else if (nextConversationFlow.nodeType === 'sendTextWait') {
                    await db.conversationFlowLog.create({
                      data: {
                        flowId: automatedFlow.Flow.id,
                        chatId: chatMessage.chatId,
                        currentConversationFlowId: nextConversationFlow.id
                      }
                    })
                    await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, nextConversationFlow.nodeData)
                    continueFlow = false
                  } else if (nextConversationFlow.nodeType === 'sendTextResponse') {
                    await db.conversationFlowLog.create({
                      data: {
                        flowId: automatedFlow.Flow.id,
                        chatId: chatMessage.chatId,
                        currentConversationFlowId: nextConversationFlow.id
                      }
                    })
                    await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, nextConversationFlow.nodeData)
                    continueFlow = false
                  } else if (nextConversationFlow.nodeType === 'sendTextResponseWait') {
                    await db.conversationFlowLog.create({
                      data: {
                        flowId: automatedFlow.Flow.id,
                        chatId: chatMessage.chatId,
                        currentConversationFlowId: nextConversationFlow.id
                      }
                    })
                    await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, nextConversationFlow.nodeData)
                    continueFlow = false
                  } else {
                    console.log("Unknown node type:", nextConversationFlow.nodeType)
                    continueFlow = false
                  }
                  currentParentNodeId = nextConversationFlow.nodeId
                } else {
                  await db.conversationFlowLog.updateMany({
                    where: {
                      flowId: automatedFlow.Flow.id,
                      chatId: chat.id,
                      status: conversationFlowStatus.CLOSED
                    },
                    data: {
                      status: conversationFlowStatus.CLOSED
                    }
                  })
                }
              }
            } else if (matchingFlow.nodeType === 'sendTextResponseWait') {
              await db.conversationFlowLog.create({
                data: {
                  flowId: automatedFlow.Flow.id,
                  chatId: chatMessage.chatId,
                  currentConversationFlowId: matchingFlow.id
                }
              })
              await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, matchingFlow.nodeData)
            }
          }
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


