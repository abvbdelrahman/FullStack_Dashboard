import { AppError } from './AppError.js'

export const canManageCourse = (user, course) => {
  if (!user || !course) return false
  if (user.role === 'admin') return true
  return user.role === 'instructor' && String(course.owner || '') === String(user._id)
}

export const assertCanManageCourse = (user, course) => {
  if (!canManageCourse(user, course)) {
    throw new AppError('Not allowed to manage this course', 403)
  }
}

export const collectCourseVideoPublicIds = (course) =>
  (course.sections || []).flatMap((section) =>
    (section.items || []).map((item) => item.cloudinaryPublicId).filter(Boolean)
  )
