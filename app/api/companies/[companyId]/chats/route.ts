import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
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

    const chats = await db.chat.findMany({
      where: {
        companyId: params.companyId
      },
      include: {
        chatMessages: true
      }
    })
    
    return new Response(JSON.stringify(chats))
  } catch (error) {
    console.log('[CHATS_GET]', error)
    return new Response(null, { status: 500 })
  }
}

