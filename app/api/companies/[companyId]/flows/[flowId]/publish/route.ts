import { getServerSession } from "next-auth"
import * as z from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

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

    // Fetch the flow data as JSON.
    const flowData = await db.flow.findUnique({
      where: {
        id: params.flowId,
      },
      select: {
        flowData: true,
      },
    })

    if (flowData) {
      if (body.published) {
        // Parse the JSON to access nodes and edges.
        const { nodes, edges } = JSON.parse(flowData.flowData as string)

        // Map nodes to the ConversationFlow model.
        for (const node of nodes) {
          const data = {
            value: node.data.value,
            replyOption: node.data.replyOption || null,
          }

          const conversationFlow = await db.conversationFlow.create({
            data: {
              nodeId: node.id,
              parentNodeId: null,
              childNodeId: null,
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
                nodeId: sourceNode.id,
                flowId: params.flowId,
              },
              data: {
                childNodeId: targetNode.id,
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
          }
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
      return new Response("Flow not found", { status: 404 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
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
