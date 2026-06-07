import { z } from 'zod'

export const noteSchema = z.object({
  title: z.string().trim().min(1, 'Note title is required'),
  course: z.string().trim().optional().default('General'),
  body: z.string().trim().min(1, 'Note body is required'),
})

export const resourceSchema = z.object({
  title: z.string().trim().min(1, 'Resource title is required'),
  course: z.string().trim().optional().default('General'),
  kind: z.enum(['PDF', 'Image', 'Design', 'Video', 'Link']).optional().default('Link'),
  size: z.string().trim().optional().default(''),
  url: z.string().trim().min(1, 'Resource URL is required'),
  saved: z.boolean().optional().default(false),
})

export const classSessionSchema = z.object({
  title: z.string().trim().min(1, 'Class title is required'),
  course: z.string().trim().optional().default('General'),
  instructor: z.string().trim().min(1, 'Instructor is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Class date must use YYYY-MM-DD'),
  time: z.string().trim().min(1, 'Class time is required'),
  duration: z.string().trim().optional().default(''),
  status: z.enum(['Upcoming', 'Live', 'Completed']).optional().default('Upcoming'),
  recordingUrl: z.string().trim().optional().default(''),
})

export const discussionSchema = z.object({
  title: z.string().trim().min(1, 'Discussion title is required'),
  course: z.string().trim().optional().default('General'),
  tags: z.array(z.string().trim()).optional().default([]),
  excerpt: z.string().trim().min(1, 'Discussion content is required'),
})

export const replySchema = z.object({
  body: z.string().trim().min(1, 'Reply is required'),
})

export const settingsSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email').optional(),
  weeklyDigest: z.boolean().optional(),
  classReminders: z.boolean().optional(),
  compactMode: z.boolean().optional(),
})

export const dashboardTaskSchema = z.object({
  title: z.string().trim().min(1, 'Task title is required'),
  date: z.string().trim().optional().default(''),
  done: z.boolean().optional().default(false),
})

export const notificationSchema = z.object({
  title: z.string().trim().min(1, 'Notification title is required'),
  description: z.string().trim().optional().default(''),
  time: z.string().trim().optional().default('Just now'),
  read: z.boolean().optional().default(false),
})
