import * as z from "zod"

import { db } from "@/lib/db"
import { hash } from 'bcrypt'

const userRegisterSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have more than 8 characters"),
  confirmPassword: z.string().min(1, "Password confirmation is required"),
})
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
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
