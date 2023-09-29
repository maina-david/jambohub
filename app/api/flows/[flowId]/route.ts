import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const routeContextSchema = z.object({
  params: z.object({
    flowId: z.string()
  }),
})

const flowPatchSchema = z.object({
  name: z.string(),
})

export async function GET(req: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this flow.
    if (!(await verifyCurrentUserHasAccessToFlow(params.flowId))) {
      return new Response(null, { status: 403 })
    }

    const flow = await db.flow.findFirst({
      where: {
        id: params.flowId
      }
    })

    if(!flow){
      return new Response("Flow not found", {status: 404})
    }

    return new Response(JSON.stringify(flow))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this flow.
    if (!(await verifyCurrentUserHasAccessToFlow(params.flowId))) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = flowPatchSchema.parse(json)

    // Update the flow.
    await db.flow.update({
      where: {
        id: params.flowId,
      },
      data: {
        name: body.name,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this flow.
    if (!(await verifyCurrentUserHasAccessToFlow(params.flowId))) {
      return new Response(null, { status: 403 })
    }

    // Delete the flow.
    await db.flow.delete({
      where: {
        id: params.flowId as string,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

// Update this function to check team members and company owners
async function verifyCurrentUserHasAccessToFlow(flowId: string) {
  return true
}
