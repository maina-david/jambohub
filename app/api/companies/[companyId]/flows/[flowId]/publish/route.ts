import { getServerSession } from "next-auth"
import * as z from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { FlowValidationError } from "@/lib/exceptions"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
    flowId: z.string(),
  }),
})

export async function PATCH(req: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this flow.
    if (!(await verifyCurrentUserHasAccessToFlow(params.flowId, params.companyId))) {
      return new Response(null, { status: 403 })
    }

    // Fetch the flow data as JSON.
    const flow = await db.flow.findUnique({
      where: {
        id: params.flowId,
      },
      select: {
        flowData: true,
      },
    })

    if (flow) {
      if (flow.flowData) {
        const jsonString = typeof flow.flowData === 'string' ? flow.flowData : JSON.stringify(flow.flowData)
        const { nodes, edges } = JSON.parse(jsonString)

        // Validate flow data
        await validateFlowData(nodes, edges)

        // Map nodes to the ConversationFlow model.
        for (const node of nodes) {
          const data = {
            value: node.data.value,
            replyOption: node.data.replyOption || null,
          }

          await db.conversationFlow.create({
            data: {
              nodeId: node.id,
              parentNodeId: null,
              nodeType: node.type,
              nodeOption: data.replyOption,
              nodeData: data.value,
              flowId: params.flowId,
            },
          })
        }

        // Map edges to link parent and child nodes.
        for (const edge of edges) {
          const sourceNode = nodes.find((node) => node.id === edge.source)
          const targetNode = nodes.find((node) => node.id === edge.target)

          if (sourceNode && targetNode) {
            await db.conversationFlow.updateMany({
              where: {
                nodeId: targetNode.id,
                flowId: params.flowId,
              },
              data: {
                parentNodeId: sourceNode.id,
              },
            })
          }
        }

        // Update the published status in the Flow model.
        await db.flow.update({
          where: {
            id: params.flowId,
          },
          data: {
            published: true,
          },
        })

        return new Response(null, { status: 200 })
      } else {
        await db.conversationFlow.deleteMany({
          where: {
            flowId: params.flowId,
          },
        })
        // Update the published status in the Flow model.
        await db.flow.update({
          where: {
            id: params.flowId,
          },
          data: {
            published: false,
          },
        })

        return new Response(null, { status: 200 })
      }
    } else {
      return new Response("Flow not found", { status: 400 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    if (error instanceof FlowValidationError) {
      return new Response(JSON.stringify(error.errors), { status: 422 })
    }

    console.log("PUBLISH_FLOW_ERROR", error)
    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToFlow(flowId: string, companyId: string) {
  const count = await db.flow.count({
    where: {
      id: flowId,
      companyId: companyId,
    },
  })

  return count > 0
}

async function validateFlowData(nodes: any[], edges: any[]) {
  const errors: { id: string, message: string }[] = []

  if (nodes.length === 0) {
    errors.push({ id: 'Flow', message: "Flow missing nodes" })
  }
  if (edges.length === 0) {
    errors.push({ id: 'Flow', message: "Flow missing edges" })
  }

  const startNode = nodes[0]

  if (!startNode) {
    errors.push({ id: 'Flow', message: "Flow missing start node" })
  }

  // Check if the first node is of type "sendText" or "sendTextWait"
  if (startNode.type !== "sendText" && startNode.type !== "sendTextWait") {
    errors.push({ id: startNode.id, message: "Start node is of an invalid type" })
  }

  // Find child nodes of the start node based on connected edges
  const childNodeIds = edges
    .filter(edge => edge.source === startNode.id)
    .map(edge => edge.target)

  // Ensure that the start node has children nodes
  if (nodes.length > 0 && childNodeIds.length === 0) {
    errors.push({ id: startNode.id, message: "Start node is missing children" })
  }

  for (const childNodeId of childNodeIds) {
    const childNode = nodes.find(node => node.id === childNodeId)
    if (!childNode) {
      errors.push({ id: childNodeId, message: "Invalid node mapped" })
    }

    // Check for unconnected nodes
    for (const node of nodes) {
      if (node.id !== startNode.id && !edges.some(edge => edge.target === node.id)) {
        errors.push({ id: node.id, message: `Unconnected node with ID ${node.id}` })
      }

      switch (node.type) {
        case 'sendText':
          if (!node.data || !node.data.value) {
            errors.push({ id: node.id, message: "Missing 'value' property for 'sendText' node" })
          }
          break
        case 'sendTextWait':
          if (!node.data || !node.data.replyOption || !node.data.value) {
            errors.push({ id: node.id, message: "Missing 'replyOption' or 'value' property for 'sendTextWait' node" })
          }
          break
        case 'sendTextResponse':
          if (!node.data || !node.data.replyOption) {
            errors.push({ id: node.id, message: "Missing 'replyOption' property for 'sendTextResponse' node" })
          }
          break
        case 'sendTextResponseWait':
          if (!node.data || !node.data.replyOption) {
            errors.push({ id: node.id, message: "Missing 'replyOption' property for 'sendTextResponseWait' node" })
          }
          break
        case 'sendAttachment':
          if (!node.data || !node.data.replyOption) {
            errors.push({ id: node.id, message: "Missing 'replyOption' property for 'sendAttachment' node" })
          }
          break
        case 'assignToTeam':
          if (!node.data || !node.data.replyOption) {
            errors.push({ id: node.id, message: "Missing 'replyOption' property for 'assignToTeam' node" })
          }
          break
        // Add more cases for other node types if needed
      }
    }
  }

  if (errors.length > 0) {
    throw new FlowValidationError(errors);
  }
}

