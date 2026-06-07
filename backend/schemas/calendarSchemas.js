import { z } from 'zod'

export const calendarEventSchema = z.object({
  title: z.string().trim().min(1, 'Event title is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Event date must use YYYY-MM-DD'),
  category: z.string().trim().optional().default(''),
  notes: z.string().trim().optional().default(''),
})
