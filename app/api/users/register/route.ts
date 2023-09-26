import * as z from "zod"

import { db } from "@/lib/db"
import { hash, genSaltSync, hashSync } from 'bcrypt'

const userRegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string()
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = userRegisterSchema.parse(json)

    const count = await db.user.count({
      where: {
        email: body.email
      }
    })

    if (count > 0) {
      return new Response("Email already taken", { status: 422 })
    }

    const hashedPassword = await hash(body.password, 12);

    const user = await db.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true
      },
    })

    return new Response(JSON.stringify(user), { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response('Registration failed!', { status: 500 })
  }
}
