export interface CourseInstructor {
  name?: string
  avatar?: string
  role?: string
}

export interface CourseResource {
  title?: string
  url?: string
}

export interface CourseLecture {
  title?: string
  label?: string
  description?: string
  duration?: string
  type?: 'video' | 'article' | 'quiz' | 'assignment'
  isPreview?: boolean
  resources?: CourseResource[]
  videoUrl?: string
  thumbnailUrl?: string
}

export interface CourseSection {
  title?: string
  items?: CourseLecture[]
}

export interface Course {
  id: string
  owner?: string
  legacyId?: number
  title: string
  description: string
  image?: string
  instructor?: CourseInstructor
  duration?: string
  modules?: string
  rating?: number
  reviews?: number
  price?: number
  whatYouLearn?: string[]
  materialIncludes?: string[]
  requirements?: string[]
  tags?: string[]
  audience?: string
  sections?: CourseSection[]
  totalLessons?: number
}

export interface CourseListResponse {
  items: Course[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface LearningCourseResponse {
  course: Course
  enrollment: null
}
