import * as z from 'zod'

export const campaignSchema = z.object({
  name: z.string().min(6),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  audience: z.enum([
    'INTERNAL',
    'GLOBAL'
  ]),
  status: z.enum([
    'PLANNED',
    'ACTIVE',
    'PAUSED',
    'COMPLETED',
    'CANCELED'
  ])
})
