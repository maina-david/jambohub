import * as z from "zod"

export const teamPatchSchema = z.object({
  name: z.string(),
  description: z.string().min(3).max(128)
})
