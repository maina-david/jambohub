import { getServerSession } from "next-auth"
import * as z from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

class NodeValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "NodeValidationError"
  }
}

class EdgeValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "EdgeValidationError"
  }
}

interface Node {
  id: string
  type: string
  parentNodeId: string | null
  data: {
    value: any
    replyOption: string | null
  }
}

interface Edge {
  source: string
  target: string
}

interface ValidationError {
  id: string
  error: Error
}

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
    flowId: z.string(),
  }),
})

const flowPatchSchema = z.object({
  published: z.boolean(),
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

    // Get the request body and validate it.
    const json = await req.json()
    const body = flowPatchSchema.parse(json)

    if (body.published) {
      const flow = await db.flow.findUnique({
        where: {
          id: params.flowId,
        },
        select: {
          flowData: true,
        },
      })

      if (flow && flow.flowData) {
        const jsonString = typeof flow.flowData === 'string' ? flow.flowData : JSON.stringify(flow.flowData)
        const { nodes, edges } = JSON.parse(jsonString)

        validateFlowData(nodes, edges)

        // Map nodes to the ConversationFlow model...
        for (const node of nodes) {
          const data = {
            value: node.data.value,
            replyOption: node.data.replyOption || null,
          }
          const conversationFlow = await db.conversationFlow.create({
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
        // Map edges to link parent and child nodes...
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

        return new Response(null, { status: 200 })
      } else {
        return new Response("Flow not found", { status: 404 })
      }
    } else {
      await db.conversationFlow.deleteMany({
        where: {
          flowId: params.flowId,
        }
      })
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
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof NodeValidationError || error instanceof EdgeValidationError) {
      return new Response(error.message, { status: 422, headers: { "Content-Type": "application/json" } })
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


function validateFlowData(nodes: Node[], edges: Edge[]) {
  const rootNodeTypes = ["sendText", "sendTextWait"]
  const nodeTypesWithReplyOption = [
    "sendTextWait",
    "sendTextResponse",
    "sendTextResponseWait",
    "sendAttachment",
    "assignToTeam"
  ]

  const nodeErrors: ValidationError[] = []
  const edgeErrors: ValidationError[] = []

  for (const node of nodes) {
    if (rootNodeTypes.includes(node.type)) {
      if (edges.every((edge) => edge.target !== node.id)) {
        nodeErrors.push({ id: node.id, error: new NodeValidationError("Root node without child node.") })
      }
    }
  }

  // Edge validation
  const nodesWithEdges = new Set<string>()
  for (const edge of edges) {
    nodesWithEdges.add(edge.source)
    nodesWithEdges.add(edge.target)
  }

  for (const node of nodes) {
    if (!nodesWithEdges.has(node.id)) {
      edgeErrors.push({ id: node.id, error: new EdgeValidationError(`Node '${node.id}' is not connected to any edge.`) })
    }
  }

  // If there are errors, throw them
  if (nodeErrors.length > 0 || edgeErrors.length > 0) {
    const allErrors = nodeErrors.concat(edgeErrors)
    throw allErrors
  }
}
