import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
    flowId: z.string()
  }),
})

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
    if (!(await verifyCurrentUserHasAccessToFlow(params.flowId, params.companyId))) {
      return new Response(null, { status: 403 })
    }

    const json = await req.json()

    // Update the flow.
    await db.flow.update({
      where: {
        id: params.flowId,
      },
      data: {
        nodes: json.flow,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error)
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

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
