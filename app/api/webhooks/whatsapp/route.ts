
export async function GET(req: Request) {
  const body = await req.json()
  if (body.hub_challenge) {
    return new Response(body.hub_challenge, { status: 200 })
  }
}
