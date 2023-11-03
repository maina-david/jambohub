import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const routeContextSchema = z.object({
  params: z.object({
    notificationId: z.string(),
  }),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route context.
    const { params } = routeContextSchema.parse(context)

    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    
    await db.notification.update({
      where: {
        userId: user.id,
        id: params.notificationId
      },
      data: {
        read: true
      }
    })

    return new Response(null, { status: 201 })
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}
