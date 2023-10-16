import { getServerSession } from "next-auth/next"
import * as z from "zod"
import { env } from "env.mjs"
import { authOptions } from "@/lib/auth"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string()
  })
})

export async function GET(request: Request, context: z.infer<typeof routeContextSchema>): Promise<Response> {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return new Response("Missing 'code' parameter", { status: 400 })
    }

    // Exchange the code for an access token.
    const facebookResponse = await exchangeCodeForAccessToken(code)

    // Now, inspect the access token using Facebook's Graph API.
    const inputToken = facebookResponse.access_token

    const inspectionResponse = await inspectAccessToken(inputToken)

    return new Response(JSON.stringify(inspectionResponse), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    // Handle errors here
    console.log('VALIDATE_CODE_GET_ERROR', error.message)
    return new Response(`An error occurred: ${error.message}`, { status: 500 })
  }
}

async function exchangeCodeForAccessToken(code: string): Promise<{ access_token: string }> {
  try {
    const appId = env.NEXT_PUBLIC_FACEBOOK_APP_ID
    const appSecret = env.FACEBOOK_APP_SECRET

    const res = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&code=${code}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      throw new Error(`Failed to exchange code for access token: ${res.statusText}`)
    }

    return await res.json()
  } catch (error) {
    throw new Error(`Error in exchangeCodeForAccessToken: ${error.message}`)
  }
}

async function inspectAccessToken(inputToken: string): Promise<{ app_id: number; user_id: string; scopes: string[] } | null> {
  try {
    const appSecret = env.FACEBOOK_APP_SECRET

    const inspectionRes = await fetch(`https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${appSecret}`)

    if (!inspectionRes.ok) {
      throw new Error(`Failed to inspect access token: ${inspectionRes.statusText}`)
    }

    const inspectionData = await inspectionRes.json()

    if (inspectionData.data) {
      const { app_id, user_id, scopes } = inspectionData.data
      return { app_id, user_id, scopes }
    }

    return null
  } catch (error) {
    throw new Error(`Error in inspectAccessToken: ${error.message}`)
  }
}
