import axios from 'axios'
import { Flow, conversationFlowStatus } from "@prisma/client"
import { db } from '@/lib/db'
import { sendMessage } from '@/services/chat-service'

export const fetchFlowDetails = (companyId: string, flowId: string): Promise<Flow> =>
  axios.get(`/api/companies/${companyId}/flows/${flowId}`).then((response) => response.data)

export const fetchCompanyFlows = (companyId: string): Promise<Flow[]> =>
  axios.get(`/api/companies/${companyId}/flows`).then((response) => response.data)

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

    let currentConversationFlowId: string | null = null

    // Find the conversation flow with parentId as null
    for (const conversationFlow of conversationFlows) {
      if (conversationFlow.parentNodeId === null) {
        currentConversationFlowId = conversationFlow.id
        break
      }
    }

    if (currentConversationFlowId) {
      const conversationFlowLog = await db.conversationFlowLog.findMany({
        where: {
          flowId: automatedFlow.Flow.id,
          chatId: chatMessage.chatId
        }
      })

      if (!conversationFlowLog) {
        await db.conversationFlowLog.create({
          data: {
            flowId: automatedFlow.Flow.id,
            chatId: chatMessage.chatId,
            currentConversationFlowId
          }
        })

        const conversationFlow = await db.conversationFlow.findFirst({
          where: {
            id: currentConversationFlowId
          }
        })

        if (!conversationFlow) {
          throw new Error("Conversation flow not found")
        }

        if (conversationFlow.nodeType === 'sendText' ||
          conversationFlow.nodeType === 'sendTextWait' ||
          conversationFlow.nodeType === 'sendTextResponse') {
          sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, conversationFlow.nodeData)
        }

      } else {
        // Handle the case where conversationFlowLog already exists
        const lastEntry = conversationFlowLog[conversationFlowLog.length - 1]
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
    } else {
      throw new Error("No conversation flow with parentId as null found")
    }
  } catch (error) {
    console.log("ERROR_HANDLING_AUTOMATED_CHAT", error)
  }
}
