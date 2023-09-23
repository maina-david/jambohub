import * as z from "zod"

export const chatflowPatchSchema = z.object({
  name: z.string().min(3).max(128),
  description: z.string().min(3).max(128),
})
