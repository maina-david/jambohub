import { db } from "@/lib/db"
import { zfd } from "zod-form-data"

const ussdSchema = zfd.formData({
  sessionId: zfd.text(),
  serviceCode: zfd.text(),
  phoneNumber: zfd.text(),
  text: zfd.text(),
})

export async function POST(request: Request) {
  const requestBody = request.body
  console.log("USSD REQ: ", requestBody)
  // const {
  //   sessionId,
  //   serviceCode,
  //   phoneNumber,
  //   text,
  // } = JSON.parse(requestBody)

  return new Response('END Webkook working', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
  // if (sessionId && serviceCode && phoneNumber && text) {
  //   const channel = await db.channel.findFirst({
  //     where: {
  //       identifier: serviceCode as string
  //     }
  //   })

  //   if (channel) {
  //     // Retrieve the automated flow associated with the channel
  //     const automatedFlow = await db.channelToFlow.findFirst({
  //       where: {
  //         channelId: channel.id
  //       },
  //       include: {
  //         Flow: true
  //       }
  //     })

  //     if (automatedFlow) {
  //       // Retrieve all conversation flows associated with the automated flow
  //       const conversationFlows = await db.conversationFlow.findMany({
  //         where: {
  //           flowId: automatedFlow.Flow.id
  //         }
  //       })

  //       // Check if there are no conversation flows or they are empty, and throw an error
  //       if (!conversationFlows || conversationFlows.length === 0) {
  //         return new Response("END USSD Flow not configured", {
  //           status: 200,
  //           headers: {
  //             'Content-Type': 'text/plain',
  //           },
  //         })
  //       }

  //       if (text == '') {
  //         const currentConversationFlow = await db.conversationFlow.findFirst({
  //           where: {
  //             parentNodeId: null,
  //             flowId: automatedFlow.Flow.id
  //           }
  //         })

  //         if (currentConversationFlow) {
  //           await db.ussdSessionLog.create({
  //             data: {
  //               flowId: automatedFlow.Flow.id,
  //               currentConversationFlowId: currentConversationFlow.id,
  //               sessionId: sessionId as string,
  //             }
  //           })
  //           return new Response(`CON ${currentConversationFlow.nodeData}`, {
  //             status: 200,
  //             headers: {
  //               'Content-Type': 'text/plain',
  //             },
  //           })
  //         }
  //       } else {
  //         const currentUssdSession = await db.ussdSessionLog.findMany({
  //           where: {
  //             flowId: automatedFlow.Flow.id,
  //             sessionId: sessionId as string,
  //             status: 'OPEN'
  //           }
  //         })
  //         if (currentUssdSession) {
  //           const lastEntry = currentUssdSession[currentUssdSession.length - 1]
  //           if (lastEntry && lastEntry.currentConversationFlowId) {
  //             const currentConversationFlow = await db.conversationFlow.findFirst({
  //               where: {
  //                 id: lastEntry.currentConversationFlowId
  //               }
  //             })

  //             if (currentConversationFlow) {
  //               const nextConversationFlows = await db.conversationFlow.findMany({
  //                 where: {
  //                   flowId: automatedFlow.Flow.id,
  //                   parentNodeId: currentConversationFlow.nodeId
  //                 }
  //               })

  //               if (currentConversationFlow.nodeType === 'sendTextWait' ||
  //                 currentConversationFlow.nodeType === 'sendTextResponseWait'
  //               ) {
  //                 //get last characters after '*' from text
  //                 const replyOption = text
  //                 //find matching flow based on text
  //                 const matchingFlow = nextConversationFlows.find((flow) => flow.nodeOption === replyOption)
  //                 if (!matchingFlow) {
  //                   return new Response('CON Invalid input', {
  //                     status: 200,
  //                     headers: {
  //                       'Content-Type': 'text/plain',
  //                     },
  //                   })
  //                 }
  //                 // get next flow
  //                 const nextConversationFlowsCount = await db.conversationFlow.count({
  //                   where: {
  //                     parentNodeId: matchingFlow.nodeId,
  //                     flowId: automatedFlow.Flow.id
  //                   }
  //                 })

  //                 if (nextConversationFlowsCount > 0) {
  //                   const ussdSession = await db.ussdSessionLog.create({
  //                     data: {
  //                       flowId: automatedFlow.Flow.id,
  //                       currentConversationFlowId: matchingFlow.id,
  //                       sessionId: sessionId as string,
  //                       textResponse: text as string
  //                     }
  //                   })

  //                   return new Response(`CON ${matchingFlow.nodeData}`)
  //                 } else {
  //                   await db.ussdSessionLog.updateMany({
  //                     where: {
  //                       flowId: automatedFlow.Flow.id,
  //                       sessionId: sessionId as string,
  //                     },
  //                     data: {
  //                       status: 'CLOSED'
  //                     }
  //                   })
  //                   return new Response(`END ${matchingFlow.nodeData}`, {
  //                     status: 200,
  //                     headers: {
  //                       'Content-Type': 'text/plain',
  //                     },
  //                   })
  //                 }
  //               }
  //             }
  //           }
  //         } else {
  //           const currentConversationFlow = await db.conversationFlow.findFirst({
  //             where: {
  //               parentNodeId: null,
  //               flowId: automatedFlow.Flow.id
  //             }
  //           })

  //           if (currentConversationFlow) {
  //             await db.ussdSessionLog.create({
  //               data: {
  //                 flowId: automatedFlow.Flow.id,
  //                 currentConversationFlowId: currentConversationFlow.id,
  //                 sessionId: sessionId as string,
  //               }
  //             })
  //             return new Response(`CON ${currentConversationFlow.nodeData}`, {
  //               status: 200,
  //               headers: {
  //                 'Content-Type': 'text/plain',
  //               },
  //             })
  //           }
  //         }
  //       }
  //     } else {
  //       return new Response("END USSD not integrated to automated flow", {
  //         status: 200,
  //         headers: {
  //           'Content-Type': 'text/plain',
  //         },
  //       })
  //     }
  //   } else {
  //     return new Response("END USSD service code not integrated", {
  //       status: 200,
  //       headers: {
  //         'Content-Type': 'text/plain',
  //       },
  //     })
  //   }
  // } else {
  //   return new Response('END Invalid Payload', {
  //     status: 200,
  //     headers: {
  //       'Content-Type': 'text/plain',
  //     },
  //   })
  // }

}
