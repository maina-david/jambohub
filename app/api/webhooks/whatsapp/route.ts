
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const hub_challenge = searchParams.get('hub_challenge')
  if (hub_challenge) {
    return new Response(hub_challenge, { status: 200 })
  }
  return new Response(null, { status: 200 })
}
