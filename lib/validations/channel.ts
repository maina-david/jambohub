import * as z from "zod"

export const channelPatchSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(3).max(128),
})
