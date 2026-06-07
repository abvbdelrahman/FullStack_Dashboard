import Order from '../models/Order.js'
import Course from '../models/Course.js'
import Enrollment from '../models/Enrollment.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getStripe, isStripeConfigured } from '../config/stripe.js'
import { fulfillOrders } from '../utils/fulfillOrders.js'

const enrollInCourse = async (userId, course) => {
  const existing = await Enrollment.findOne({ user: userId, course: course._id })
  if (existing) return false

  await Enrollment.create({
    user: userId,
    course: course._id,
    totalLessons: course.totalLessons || 20,
  })

  return true
}

export const createCheckoutSession = asyncHandler(async (req, res) => {
  throw new AppError('Checkout is disabled for instructor/admin-only mode', 410)

  const { courseIds } = req.body

  if (!Array.isArray(courseIds) || courseIds.length === 0) {
    throw new AppError('At least one course is required', 400)
  }

  const uniqueCourseIds = [...new Set(courseIds.map(String))]
  const courses = await Course.find({ _id: { $in: uniqueCourseIds } })

  if (courses.length !== uniqueCourseIds.length) {
    throw new AppError('One or more courses were not found', 404)
  }

  const freeCourses = courses.filter((course) => course.price === 0)
  const paidCourses = courses.filter((course) => course.price > 0)

  for (const course of courses) {
    const alreadyEnrolled = await Enrollment.findOne({ user: req.user._id, course: course._id })
    if (alreadyEnrolled) {
      throw new AppError(`You are already enrolled in "${course.title}"`, 400)
    }
  }

  const enrolledFree = []
  for (const course of freeCourses) {
    const enrolled = await enrollInCourse(req.user._id, course)
    if (enrolled) enrolledFree.push(course._id.toString())
  }

  if (paidCourses.length === 0) {
    return res.json({ free: true, enrolled: enrolledFree })
  }

  if (!isStripeConfigured()) {
    throw new AppError('Stripe is not configured on the server', 503)
  }

  const orders = await Promise.all(
    paidCourses.map((course) =>
      Order.create({
        user: req.user._id,
        course: course._id,
        amount: course.price,
        paymentStatus: 'pending',
      })
    )
  )

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
  const stripe = getStripe()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: req.user.email,
    line_items: paidCourses.map((course) => ({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(course.price * 100),
        product_data: {
          name: course.title,
          description: course.description?.slice(0, 200) || undefined,
          images: course.image ? [course.image] : undefined,
        },
      },
    })),
    metadata: {
      userId: req.user._id.toString(),
      orderIds: orders.map((order) => order._id.toString()).join(','),
    },
    success_url: `${clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/checkout/cancel`,
  })

  await Order.updateMany(
    { _id: { $in: orders.map((order) => order._id) } },
    { stripeSessionId: session.id }
  )

  res.status(201).json({
    url: session.url,
    sessionId: session.id,
    enrolledFree,
  })
})

export const verifyCheckoutSession = asyncHandler(async (req, res) => {
  throw new AppError('Checkout verification is disabled for instructor/admin-only mode', 410)

  const { sessionId } = req.params

  if (!sessionId) {
    throw new AppError('Session ID is required', 400)
  }

  if (!isStripeConfigured()) {
    throw new AppError('Stripe is not configured on the server', 503)
  }

  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.metadata?.userId !== req.user._id.toString()) {
    throw new AppError('You do not have access to this checkout session', 403)
  }

  if (session.payment_status !== 'paid') {
    return res.json({
      paid: false,
      status: session.payment_status,
    })
  }

  const orderIds = session.metadata?.orderIds?.split(',').filter(Boolean) || []
  const enrolled = await fulfillOrders(orderIds)

  res.json({
    paid: true,
    success: true,
    enrolled,
  })
})

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('course', 'title image price')
    .sort({ createdAt: -1 })

  res.json(orders)
})
