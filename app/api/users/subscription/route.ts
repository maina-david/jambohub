import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const subscription = await db.subscription.findFirst({
      where: {
        userId: user.id,
      },
    })

    return new Response(JSON.stringify(subscription))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}