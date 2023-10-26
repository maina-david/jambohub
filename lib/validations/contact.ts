import * as z from "zod"

export const createContactSchema = z.object({
    name: z.string().min(2).max(50),
    alias: z.string().min(2).max(50).optional(),
    channel: z.enum(['WHATSAPP']),
    identifier: z.string().min(1)
  })
