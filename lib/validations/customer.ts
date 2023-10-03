import * as z from "zod"

export const CreateCustomerSchema = z.object({
  fullNames: z.string().min(3),
  identification: z.string().min(8),
  email: z.string().email().optional(),
  phone: z.string(),
  occupation: z.string().optional()
})
