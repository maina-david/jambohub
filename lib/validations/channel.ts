import * as z from "zod"

export const channelPatchSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(3).max(128),
})

export const smsChannelSchema = z.object({
  name: z.string().min(1),
  provider: z.enum(['AT', 'BONGA']),
  shortCode: z.string().min(1),
  username: z.string().min(1),
  apiKey: z.string().min(1),
  apiSecret: z.string().optional()
})

export const ussdChannelSchema = z.object({
  name: z.string().min(1),
  provider: z.enum(['AT']),
  serviceCode: z.string().min(1),
  username: z.string().min(1),
  apiKey: z.string().min(1)
})
