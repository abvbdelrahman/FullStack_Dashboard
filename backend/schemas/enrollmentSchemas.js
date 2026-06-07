import { z } from 'zod'

export const enrollmentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
})

export const progressSchema = z
  .object({
    currentLesson: z.number().int().min(0).optional(),
    progress: z.number().min(0).max(100).optional(),
  })
  .refine((data) => data.currentLesson !== undefined || data.progress !== undefined, {
    message: 'Progress or current lesson is required',
  })

export const completeLessonSchema = z.object({
  sectionIndex: z.number().int().min(0),
  lectureIndex: z.number().int().min(0),
})
