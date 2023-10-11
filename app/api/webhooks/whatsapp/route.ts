import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const hubChallenge = searchParams.get('hub.challenge')
  if (hubChallenge) {
    return new Response(hubChallenge, { status: 200 })
  }
  return new Response(null, { status: 200 })
}
