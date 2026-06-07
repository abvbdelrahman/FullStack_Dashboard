import Course from '../models/Course.js'
import Enrollment from '../models/Enrollment.js'
import Order from '../models/Order.js'
import Review from '../models/Review.js'
import { deleteVideoAssets, getVideoThumbnailUrl, uploadVideoBuffer } from '../config/cloudinary.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  assertCanManageCourse,
  collectCourseVideoPublicIds,
} from '../utils/courseAccess.js'

const sanitizeSections = (sections = [], includeProtectedContent = false) =>
  sections.map((section) => ({
    title: section.title,
    items: (section.items || []).map((item) => ({
      title: item.title,
      label: item.label,
      description: item.description,
      duration: item.duration,
      type: item.type,
      isPreview: item.isPreview,
      resources: item.resources,
      ...(includeProtectedContent
        ? {
            videoUrl: item.videoUrl,
            cloudinaryPublicId: item.cloudinaryPublicId,
            thumbnailUrl: item.thumbnailUrl,
          }
        : {}),
    })),
  }))

const formatCourse = (course, options = {}) => ({
  id: course._id,
  owner: course.owner,
  legacyId: course.legacyId,
  title: course.title,
  description: course.description,
  image: course.image,
  instructor: course.instructor,
  duration: course.duration,
  modules: course.modules,
  rating: course.rating,
  reviews: course.reviews,
  price: course.price,
  whatYouLearn: course.whatYouLearn,
  materialIncludes: course.materialIncludes,
  requirements: course.requirements,
  tags: course.tags,
  audience: course.audience,
  sections: sanitizeSections(course.sections, options.includeProtectedContent),
  totalLessons: course.totalLessons,
})

const countLessons = (sections = []) =>
  sections.reduce((total, section) => total + (section.items?.length || 0), 0)

const normalizeCoursePayload = (payload) => ({
  ...payload,
  totalLessons: countLessons(payload.sections || []),
})

const getPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1)
  const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 50)
  const skip = (page - 1) * limit

  return { page, limit, skip }
}

const sendPaginatedCourses = async (res, query, filter = {}, sort = { createdAt: -1 }) => {
  const { page, limit, skip } = getPagination(query)
  const [courses, total] = await Promise.all([
    Course.find(filter).sort(sort).skip(skip).limit(limit),
    Course.countDocuments(filter),
  ])

  res.json({
    items: courses.map(formatCourse),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

const getCourseAccessFilter = (user) => (user.role === 'admin' ? {} : { owner: user._id })

export const getCourses = asyncHandler(async (req, res) => {
  await sendPaginatedCourses(res, req.query, getCourseAccessFilter(req.user))
})

export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ _id: req.params.id, ...getCourseAccessFilter(req.user) })
  if (!course) throw new AppError('Course not found', 404)
  res.json(formatCourse(course))
})

export const getLearningCourse = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ _id: req.params.id, ...getCourseAccessFilter(req.user) })
  if (!course) throw new AppError('Course not found', 404)

  res.json({
    course: formatCourse(course, { includeProtectedContent: true }),
    enrollment: null,
  })
})

export const searchCourses = asyncHandler(async (req, res) => {
  const q = req.query.q?.trim()
  if (!q) {
    return sendPaginatedCourses(res, req.query, getCourseAccessFilter(req.user))
  }

  await sendPaginatedCourses(res, req.query, {
    ...getCourseAccessFilter(req.user),
    $or: [
      { $text: { $search: q } },
      { title: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
    ],
  })
})

export const createCourse = asyncHandler(async (req, res) => {
  const payload = normalizeCoursePayload({
    ...req.body,
    owner: req.user._id,
    instructor: req.body.instructor || {
      name: req.user.name,
      avatar: req.user.avatar,
      role: 'Instructor',
    },
  })
  const course = await Course.create(payload)
  res.status(201).json(formatCourse(course, { includeProtectedContent: true }))
})

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course) throw new AppError('Course not found', 404)
  assertCanManageCourse(req.user, course)

  Object.assign(course, req.body)
  course.totalLessons = countLessons(course.sections)
  await course.save()

  res.json(formatCourse(course, { includeProtectedContent: true }))
})

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course) throw new AppError('Course not found', 404)
  assertCanManageCourse(req.user, course)

  await deleteVideoAssets(collectCourseVideoPublicIds(course))

  await Promise.all([
    Course.deleteOne({ _id: course._id }),
    Enrollment.deleteMany({ course: course._id }),
    Review.deleteMany({ course: course._id }),
    Order.deleteMany({ course: course._id }),
  ])

  res.json({ success: true })
})

export const addCourseSection = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course) throw new AppError('Course not found', 404)
  assertCanManageCourse(req.user, course)

  course.sections.push({ title: req.body.title, items: [] })
  await course.save()

  res.status(201).json(formatCourse(course))
})

export const updateCourseSection = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course) throw new AppError('Course not found', 404)
  assertCanManageCourse(req.user, course)

  const sectionIndex = Number(req.params.sectionIndex)
  if (!Number.isInteger(sectionIndex) || sectionIndex < 0 || sectionIndex >= course.sections.length) {
    throw new AppError('Section not found', 404)
  }

  course.sections[sectionIndex].title = req.body.title
  course.markModified('sections')
  await course.save()

  res.json(formatCourse(course, { includeProtectedContent: true }))
})

export const deleteCourseSection = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course) throw new AppError('Course not found', 404)
  assertCanManageCourse(req.user, course)

  const sectionIndex = Number(req.params.sectionIndex)
  if (!Number.isInteger(sectionIndex) || sectionIndex < 0 || sectionIndex >= course.sections.length) {
    throw new AppError('Section not found', 404)
  }

  await deleteVideoAssets(
    (course.sections[sectionIndex].items || [])
      .map((item) => item.cloudinaryPublicId)
      .filter(Boolean)
  )

  course.sections.splice(sectionIndex, 1)
  course.totalLessons = countLessons(course.sections)
  course.markModified('sections')
  await course.save()

  res.json(formatCourse(course, { includeProtectedContent: true }))
})

export const addCourseLecture = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course) throw new AppError('Course not found', 404)
  assertCanManageCourse(req.user, course)

  const sectionIndex = Number(req.params.sectionIndex)
  if (!Number.isInteger(sectionIndex) || sectionIndex < 0 || sectionIndex >= course.sections.length) {
    throw new AppError('Section not found', 404)
  }

  const lecture = {
    ...req.body,
    label: req.body.label || req.body.title,
  }

  course.sections[sectionIndex].items.push(lecture)
  course.totalLessons = countLessons(course.sections)
  await course.save()

  res.status(201).json(formatCourse(course))
})

export const updateCourseLecture = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course) throw new AppError('Course not found', 404)
  assertCanManageCourse(req.user, course)

  const sectionIndex = Number(req.params.sectionIndex)
  const lectureIndex = Number(req.params.lectureIndex)
  const lecture = course.sections[sectionIndex]?.items?.[lectureIndex]

  if (!lecture) throw new AppError('Lecture not found', 404)

  Object.assign(lecture, req.body)
  if (!lecture.label && lecture.title) lecture.label = lecture.title

  course.markModified('sections')
  await course.save()

  res.json(formatCourse(course, { includeProtectedContent: true }))
})

export const deleteCourseLecture = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course) throw new AppError('Course not found', 404)
  assertCanManageCourse(req.user, course)

  const sectionIndex = Number(req.params.sectionIndex)
  const lectureIndex = Number(req.params.lectureIndex)
  const section = course.sections[sectionIndex]

  if (!section?.items?.[lectureIndex]) throw new AppError('Lecture not found', 404)

  await deleteVideoAssets([section.items[lectureIndex].cloudinaryPublicId])

  section.items.splice(lectureIndex, 1)
  course.totalLessons = countLessons(course.sections)
  course.markModified('sections')
  await course.save()

  res.json(formatCourse(course, { includeProtectedContent: true }))
})

export const uploadCourseLectureVideo = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Video file is required', 400)

  const course = await Course.findById(req.params.id)
  if (!course) throw new AppError('Course not found', 404)
  assertCanManageCourse(req.user, course)

  const sectionIndex = Number(req.params.sectionIndex)
  const lectureIndex = Number(req.params.lectureIndex)
  const section = course.sections[sectionIndex]
  const lecture = section?.items?.[lectureIndex]

  if (!section || !lecture) {
    throw new AppError('Lecture not found', 404)
  }

  await deleteVideoAssets([lecture.cloudinaryPublicId])

  const result = await uploadVideoBuffer(req.file.buffer, {
    public_id: `${course._id}/section-${sectionIndex}/lecture-${lectureIndex}`,
  })

  lecture.videoUrl = result.secure_url
  lecture.cloudinaryPublicId = result.public_id
  lecture.thumbnailUrl = getVideoThumbnailUrl(result.public_id)
  lecture.type = 'video'

  if (!lecture.duration && result.duration) {
    const minutes = Math.floor(result.duration / 60)
    const seconds = Math.round(result.duration % 60).toString().padStart(2, '0')
    lecture.duration = `${minutes}:${seconds}`
  }

  course.markModified('sections')
  await course.save()

  res.json({
    course: formatCourse(course, { includeProtectedContent: true }),
    lecture,
  })
})
