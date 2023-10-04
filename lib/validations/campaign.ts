import * as z from 'zod'

export const campaignSchema = z.object({
  name: z.string().min(6),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  type: z.enum(['INTERNAL', 'GLOBAL'])
})
