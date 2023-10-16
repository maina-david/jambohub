import { getServerSession } from "next-auth/next"
import * as z from "zod"
import { env } from "env.mjs"
import { authOptions } from "@/lib/auth"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
  }),
})

export async function GET(request: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    const appId = env.NEXT_PUBLIC_FACEBOOK_APP_ID
    const appSecret = env.FACEBOOK_APP_SECRET
    const response = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&code=${code}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data: { access_token: string } = await response.json()

    if (!response.ok) {
      return new Response("Failed to verify code", { status: 422 })
    }

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {

  }
}
