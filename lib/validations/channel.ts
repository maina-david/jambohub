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

export const whatsAppChannelSchema = z.object({
  name: z.string().min(1),
  phoneNumber: z.string().min(1),
  phoneNumberId: z.string().min(1),
  accessToken: z.string().min(1)
})
