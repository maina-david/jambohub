import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const routeContextSchema = z.object({
  params: z.object({
    chatId: z.string(),
  }),
})

export async function GET(
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

    const chatMessages = await db.chatMessage.findFirst({
      where: {
        id: params.chatId
      },
    })

    return new Response(JSON.stringify(chatMessages), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
