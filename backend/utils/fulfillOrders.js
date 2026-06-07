import Order from '../models/Order.js'
import Course from '../models/Course.js'
import Enrollment from '../models/Enrollment.js'

export const fulfillOrders = async (orderIds) => {
  const fulfilled = []

  for (const orderId of orderIds) {
    if (!orderId) continue

    const order = await Order.findById(orderId)
    if (!order) continue

    if (order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid'
      await order.save()
    }

    const existing = await Enrollment.findOne({ user: order.user, course: order.course })
    if (!existing) {
      const course = await Course.findById(order.course)
      await Enrollment.create({
        user: order.user,
        course: order.course,
        totalLessons: course?.totalLessons || 20,
      })
    }

    fulfilled.push(order.course.toString())
  }

  return fulfilled
}
