import Enrollment from '../models/Enrollment.js'
import Course from '../models/Course.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { calculateProgress, countLessons, getLessonKey } from '../utils/progress.js'

const formatEnrollment = (enrollment) => ({
  id: enrollment._id,
  course: {
    id: enrollment.course._id,
    title: enrollment.course.title,
    description: enrollment.course.description,
    image: enrollment.course.image,
    instructor: enrollment.course.instructor,
    price: enrollment.course.price,
  },
  currentLesson: enrollment.currentLesson,
  totalLessons: enrollment.totalLessons,
  progress: enrollment.progress,
  completedLessons: enrollment.completedLessons,
  status: enrollment.status,
})

export const enroll = asyncHandler(async (req, res) => {
  throw new AppError('Enrollment is disabled for instructor/admin-only mode', 410)

  const course = await Course.findById(req.body.courseId)
  if (!course) throw new AppError('Course not found', 404)

  if (course.price > 0) {
    throw new AppError('Paid courses require checkout before enrollment', 402)
  }

  const existing = await Enrollment.findOne({ user: req.user._id, course: course._id })
  if (existing) throw new AppError('Already enrolled in this course', 400)

  const enrollment = await Enrollment.create({
    user: req.user._id,
    course: course._id,
    totalLessons: course.totalLessons || 20,
    currentLesson: 1,
    progress: 0,
  })

  const populated = await Enrollment.findById(enrollment._id).populate('course')
  res.status(201).json(formatEnrollment(populated))
})

export const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id })
    .populate('course')
    .sort({ updatedAt: -1 })

  res.json(enrollments.map(formatEnrollment))
})

export const updateProgress = asyncHandler(async (req, res) => {
  throw new AppError('Lesson progress is disabled for instructor/admin-only mode', 410)

  const enrollment = await Enrollment.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate('course')

  if (!enrollment) throw new AppError('Enrollment not found', 404)

  const { currentLesson, progress } = req.body
  if (currentLesson !== undefined) enrollment.currentLesson = currentLesson
  if (progress !== undefined) enrollment.progress = Math.min(100, Math.max(0, progress))

  if (enrollment.progress >= 100) enrollment.status = 'completed'

  await enrollment.save()
  res.json(formatEnrollment(enrollment))
})

export const completeLesson = asyncHandler(async (req, res) => {
  throw new AppError('Lesson progress is disabled for instructor/admin-only mode', 410)

  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: req.params.courseId,
  }).populate('course')

  if (!enrollment) throw new AppError('Enrollment not found', 404)

  const sectionIndex = Number(req.body.sectionIndex)
  const lectureIndex = Number(req.body.lectureIndex)
  const lesson = enrollment.course.sections?.[sectionIndex]?.items?.[lectureIndex]

  if (!lesson) throw new AppError('Lesson not found', 404)

  const lessonKey = getLessonKey(sectionIndex, lectureIndex)
  if (!enrollment.completedLessons.includes(lessonKey)) {
    enrollment.completedLessons.push(lessonKey)
  }

  const totalLessons = countLessons(enrollment.course.sections) || enrollment.totalLessons || 1
  enrollment.totalLessons = totalLessons
  enrollment.currentLesson = Math.min(enrollment.completedLessons.length + 1, totalLessons)
  enrollment.progress = calculateProgress(enrollment.completedLessons, totalLessons)
  enrollment.status = enrollment.progress >= 100 ? 'completed' : 'active'

  await enrollment.save()
  res.json(formatEnrollment(enrollment))
})
