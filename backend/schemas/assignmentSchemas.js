import { z } from 'zod'

export const assignmentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  title: z.string().trim().min(1, 'Assignment title is required'),
  description: z.string().optional().default(''),
  dueDate: z.coerce.date(),
  maxPoints: z.number().min(0).optional().default(100),
})

export const updateAssignmentSchema = z.object({
  title: z.string().trim().min(1, 'Assignment title is required').optional(),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  status: z.enum(['Pending', 'Progress', 'Done']).optional(),
  maxPoints: z.number().min(0).optional(),
})

export const submitAssignmentSchema = z.object({
  submissionFile: z.string().trim().min(1, 'Submission file is required'),
  cloudinaryPublicId: z.string().trim().optional().default(''),
})
