import * as z from "zod"

export const userAuthSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1)
})
