import { getServerSession } from "next-auth/next"
import * as z from "zod"
import { env } from "env.mjs"
import { authOptions } from "@/lib/auth"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
  }),
})

const whatsAppCodeValidationSchema = z.object({
  code: z.string().min(1)
})
export async function POST(request: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    const json = await request.json()
    const body = whatsAppCodeValidationSchema.parse(json)

    const code = body.code
    const appId = env.NEXT_PUBLIC_FACEBOOK_APP_ID
    const appSecret = env.FACEBOOK_APP_SECRET
    const res = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&code=${code}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return new Response(JSON.stringify(res), { status: 200 })
  } catch (error) {

  }
}
