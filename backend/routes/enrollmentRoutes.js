import { Router } from 'express'
import { completeLesson, enroll, getMyEnrollments, updateProgress } from '../controllers/enrollmentController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { completeLessonSchema, enrollmentSchema, progressSchema } from '../schemas/enrollmentSchemas.js'

const router = Router()

router.use(protect)
router.post('/', validate(enrollmentSchema), enroll)
router.get('/me', getMyEnrollments)
router.patch('/course/:courseId/complete-lesson', validate(completeLessonSchema), completeLesson)
router.patch('/:id/progress', validate(progressSchema), updateProgress)

export default router
