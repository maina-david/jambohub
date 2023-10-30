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

    const { params } = routeContextSchema.parse(context)

    return new Response(null, { status: 200 })
  } catch (error) {

  }
}
