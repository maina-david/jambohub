import { db } from "@/lib/db"
import { sendMessage } from "@/services/chat-service"
import { conversationFlowStatus } from "@prisma/client"

export const handleAutomatedChat = async (chatMessageId: string) => {
  try {
    // Retrieve the chat message using the provided ID
    const chatMessage = await db.chatMessage.findFirst({
      where: {
        id: chatMessageId
      },
    })

    // Check if the chat message is not found and throw an error if it doesn't exist
    if (!chatMessage) {
      throw new Error("Chat message not found")
    }

    // Retrieve the chat associated with the chat message
    const chat = await db.chat.findFirst({
      where: {
        id: chatMessage.chatId
      },
      include: {
        Contact: true
      }
    })

    // Check if the chat is not found and throw an error if it doesn't exist
    if (!chat) {
      throw new Error("Chat not found")
    }

    // Retrieve the automated flow associated with the chat's channel
    const automatedFlow = await db.channelToFlow.findFirst({
      where: {
        channelId: chat.channelId
      },
      include: {
        Flow: true
      }
    })

    // Check if the automated flow is not found and throw an error if it doesn't exist
    if (!automatedFlow) {
      throw new Error("Channel not linked to an automated flow")
    }

    // Retrieve all conversation flows associated with the automated flow
    const conversationFlows = await db.conversationFlow.findMany({
      where: {
        flowId: automatedFlow.Flow.id
      }
    })

    // Check if there are no conversation flows or they are empty, and throw an error
    if (!conversationFlows || conversationFlows.length === 0) {
      throw new Error("Conversation flows not found")
    }

    // Retrieve the conversation flow log for the current chat
    const conversationFlowLog = await db.conversationFlowLog.findMany({
      where: {
        flowId: automatedFlow.Flow.id,
        chatId: chatMessage.chatId,
        status: conversationFlowStatus.OPEN
      }
    })

    // Check if there are no conversation flow logs or they are empty
    if (!conversationFlowLog || conversationFlowLog.length === 0) {
      // Initialize variables for tracking the flow
      let currentParentNodeId: string | null = null
      let continueFlow: boolean = true

      while (continueFlow) {
        // Find the next conversation flow based on the current node
        const currentConversationFlow = await db.conversationFlow.findFirst({
          where: {
            parentNodeId: currentParentNodeId,
            flowId: automatedFlow.Flow.id
          }
        })

        // If no next conversation flow is found, stop the flow and throw an error
        if (!currentConversationFlow) {
          continueFlow = false
          throw new Error("Conversation flow not found")
        }

        // Check the type of the current conversation flow
        if (currentConversationFlow.nodeType === 'sendText' || currentConversationFlow.nodeType === 'sendTextResponse') {
          // Create a new entry in the conversation flow log
          await db.conversationFlowLog.create({
            data: {
              flowId: automatedFlow.Flow.id,
              chatId: chatMessage.chatId,
              currentConversationFlowId: currentConversationFlow.id
            }
          })

          // Send a text message using the chat service
          await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, currentConversationFlow.nodeData)

          // Find the next child flows
          const nextChildFlow = await db.conversationFlow.findMany({
            where: {
              parentNodeId: currentConversationFlow.nodeId,
              flowId: automatedFlow.Flow.id
            }
          })

          // If no child flows are found, close the flow
          if (!nextChildFlow || nextChildFlow.length === 0) {
            await db.conversationFlowLog.updateMany({
              where: {
                flowId: automatedFlow.Flow.id,
                chatId: chat.id,
                status: conversationFlowStatus.OPEN
              },
              data: {
                status: conversationFlowStatus.CLOSED
              }
            })
            continueFlow = false
          }
        } else if (currentConversationFlow.nodeType === 'sendTextWait') {
          // Handle sendTextWait type
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
          // Handle sendTextResponseWait type
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
            await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, "Invalid input")
          } else {

            if (matchingFlow.nodeType === 'sendText' || matchingFlow.nodeType === 'sendTextResponse') {
              await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, matchingFlow.nodeData)

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
                    // Create a new entry in the conversation flow log
                    await db.conversationFlowLog.create({
                      data: {
                        flowId: automatedFlow.Flow.id,
                        chatId: chatMessage.chatId,
                        currentConversationFlowId: nextConversationFlow.id
                      }
                    })
                    // Send a text message using the chat service
                    await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, nextConversationFlow.nodeData)
                  } else if (nextConversationFlow.nodeType === 'sendTextWait') {
                    // Handle sendTextWait type
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
                    // Create a new entry in the conversation flow log
                    await db.conversationFlowLog.create({
                      data: {
                        flowId: automatedFlow.Flow.id,
                        chatId: chatMessage.chatId,
                        currentConversationFlowId: nextConversationFlow.id
                      }
                    })
                    // Send a text message using the chat service
                    await sendMessage(chat.channelId, 'TEXT', chat.Contact.identifier, nextConversationFlow.nodeData)
                    continueFlow = false
                  } else if (nextConversationFlow.nodeType === 'sendTextResponseWait') {
                    // Handle sendTextResponseWait type
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
                  // Update the status to CLOSED if there are no more flows
                  await db.conversationFlowLog.updateMany({
                    where: {
                      flowId: automatedFlow.Flow.id,
                      chatId: chat.id,
                      status: conversationFlowStatus.OPEN
                    },
                    data: {
                      status: conversationFlowStatus.CLOSED
                    }
                  })
                }
              }
            } else if (matchingFlow.nodeType === 'sendTextResponseWait') {
              // Handle sendTextResponseWait type
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
    // Catch and log any errors that occur during the process
    console.log("ERROR_HANDLING_AUTOMATED_CHAT", error)
  }
}
