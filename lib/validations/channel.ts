import * as z from "zod"

export const channelPatchSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(3).max(128),
})

export const smsChannelSchema = z.object({
  name: z.string().min(1),
  shortCode: z.string().min(1),
  username: z.string().min(1),
  apiKey: z.string().min(1)
})

export const ussdChannelSchema = z.object({
  name: z.string().min(1),
  serviceCode: z.string().min(1),
  username: z.string().min(1),
  apiKey: z.string().min(1)
})
