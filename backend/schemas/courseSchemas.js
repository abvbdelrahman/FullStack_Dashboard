import { z } from 'zod'

const resourceSchema = z.object({
  title: z.string().min(1, 'Resource title is required'),
  url: z.string().url('Resource URL must be valid'),
})

const instructorSchema = z.object({
  name: z.string().min(2, 'Instructor name must be at least 2 characters'),
  avatar: z.string().url('Instructor avatar must be valid').optional().or(z.literal('')).default(''),
  role: z.string().optional().default('Instructor'),
})

export const sectionSchema = z.object({
  title: z.string().min(2, 'Section title must be at least 2 characters'),
})

export const lectureSchema = z.object({
  title: z.string().min(2, 'Lecture title must be at least 2 characters'),
  label: z.string().optional(),
  description: z.string().optional().default(''),
  duration: z.string().optional().default(''),
  videoUrl: z.string().url('Video URL must be valid').optional().or(z.literal('')).default(''),
  type: z.enum(['video', 'article', 'quiz', 'assignment']).optional().default('video'),
  isPreview: z.boolean().optional().default(false),
  resources: z.array(resourceSchema).optional().default([]),
})

export const courseSchema = z.object({
  title: z.string().min(2, 'Course title must be at least 2 characters'),
  description: z.string().optional().default(''),
  image: z.string().url('Course image must be valid').optional().or(z.literal('')).default(''),
  instructor: instructorSchema.optional(),
  duration: z.string().optional().default(''),
  modules: z.string().optional().default(''),
  rating: z.number().min(0).max(5).optional().default(0),
  reviews: z.number().min(0).optional().default(0),
  price: z.number().min(0).optional().default(0),
  whatYouLearn: z.array(z.string()).optional().default([]),
  materialIncludes: z.array(z.string()).optional().default([]),
  requirements: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  audience: z.string().optional().default(''),
  sections: z
    .array(
      sectionSchema.extend({
        items: z.array(lectureSchema).optional().default([]),
      })
    )
    .optional()
    .default([]),
})

export const updateCourseSchema = courseSchema.partial()
export const updateLectureSchema = lectureSchema.partial()
