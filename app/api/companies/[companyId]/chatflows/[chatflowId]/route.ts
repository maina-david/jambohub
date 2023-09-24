import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { chatflowPatchSchema } from "@/lib/validations/chatflow"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
    chatflowId: z.string()
  }),
})

export async function GET(req: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this chatflow.
    if (!(await verifyCurrentUserHasAccessToChatflow(params.chatflowId, params.companyId))) {
      return new Response(null, { status: 403 })
    }

    const chatflow = await db.chatflow.findFirst({
      where: {
        id: params.chatflowId
      },
      select: {
        id: true,
        name: true,
        description: true,
        nodes: true
      }
    })

    return new Response(JSON.stringify(chatflow))
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

    // Check if the user has access to this chatflow.
    if (!(await verifyCurrentUserHasAccessToChatflow(params.chatflowId, params.companyId))) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = chatflowPatchSchema.parse(json)

    // Update the chatflow.
    await db.chatflow.update({
      where: {
        id: params.chatflowId,
      },
      data: {
        name: body.name,
        description: body.description
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

    // Check if the user has access to this chatflow.
    if (!(await verifyCurrentUserHasAccessToChatflow(params.chatflowId, params.companyId))) {
      return new Response(null, { status: 403 })
    }

    // Delete the chatflow.
    await db.chatflow.delete({
      where: {
        id: params.chatflowId as string,
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

async function verifyCurrentUserHasAccessToChatflow(chatflowId: string, companyId: string) {
  const count = await db.chatflow.count({
    where: {
      id: chatflowId,
      companyId: companyId,
    },
  })

  return count > 0
}
