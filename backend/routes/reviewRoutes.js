import { Router } from 'express'
import { getCourseReviews, createReview } from '../controllers/reviewController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { reviewSchema } from '../schemas/reviewSchemas.js'

const router = Router()

router.get('/course/:courseId', getCourseReviews)
router.post('/course/:courseId', protect, validate(reviewSchema), createReview)

export default router
