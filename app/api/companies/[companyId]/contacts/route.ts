import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { createContactSchema } from '@/lib/validations/contact'

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

    const contacts = await db.contact.findMany({
      where: {
        companyId: params.companyId
      },
    })
    return new Response(JSON.stringify(contacts))
  } catch (error) {
    console.log('[contactS_GET]', error)
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    const json = await req.json()
    const body = createContactSchema.parse(json)

    const contact = await db.contact.create({
      data: {
        companyId: params.companyId,
        channel: body.channel,
        name: body.name,
        alias: body.alias,
        identifier: body.identifier
      }
    })

    return new Response(JSON.stringify(contact), { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

