import Review from '../models/Review.js'
import Course from '../models/Course.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getCourseReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ course: req.params.courseId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })

  res.json(
    reviews.map((r) => ({
      id: r._id,
      rating: r.rating,
      comment: r.comment,
      user: { name: r.user.name, avatar: r.user.avatar },
      createdAt: r.createdAt,
    }))
  )
})

export const createReview = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId)
  if (!course) throw new AppError('Course not found', 404)

  const review = await Review.create({
    course: course._id,
    user: req.user._id,
    rating: req.body.rating,
    comment: req.body.comment || '',
  })

  const allReviews = await Review.find({ course: course._id })
  const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
  course.rating = Math.round(avg * 10) / 10
  course.reviews = allReviews.length
  await course.save()

  res.status(201).json({ id: review._id, rating: review.rating, comment: review.comment })
})
