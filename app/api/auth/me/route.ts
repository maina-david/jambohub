import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { user } = session

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id
      }
    })

    if (!dbUser) {
      return new Response("Unauthorized", { status: 401 })
    }

    return new Response(JSON.stringify(dbUser), { status: 200 })

  } catch (error) {
    return new Response('Unable to get user details', { status: 500 })
  }
}
