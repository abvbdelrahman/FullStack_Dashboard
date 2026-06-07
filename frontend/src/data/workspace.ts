export type FileKind = 'PDF' | 'Image' | 'Design' | 'Video' | 'Link'

export interface LearningFile {
  id: string
  title: string
  course: string
  kind: FileKind
  size: string
  updatedAt: string
  url: string
}

export interface ClassSession {
  id: string
  title: string
  course: string
  instructor: string
  date: string
  time: string
  duration: string
  status: 'Upcoming' | 'Live' | 'Completed'
  recordingUrl?: string
}

export interface DiscussionThread {
  id: string
  title: string
  course: string
  author: string
  replies: number
  lastActivity: string
  tags: string[]
  excerpt: string
}
