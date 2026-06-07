import { z } from 'zod'

export const checkoutSessionSchema = z.object({
  courseIds: z.array(z.string().min(1, 'Course ID is required')).min(1, 'At least one course is required'),
})
