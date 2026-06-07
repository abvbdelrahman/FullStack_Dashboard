import { Router } from 'express'
import {
  addCourseLecture,
  addCourseSection,
  createCourse,
  deleteCourse,
  deleteCourseLecture,
  deleteCourseSection,
  getCourses,
  getCourseById,
  getLearningCourse,
  searchCourses,
  updateCourse,
  updateCourseLecture,
  updateCourseSection,
  uploadCourseLectureVideo,
} from '../controllers/courseController.js'
import { authorize, protect } from '../middleware/auth.js'
import { uploadLectureVideo } from '../middleware/upload.js'
import { validate } from '../middleware/validate.js'
import {
  courseSchema,
  lectureSchema,
  sectionSchema,
  updateCourseSchema,
  updateLectureSchema,
} from '../schemas/courseSchemas.js'

const router = Router()

router.get('/search', protect, searchCourses)
router.get('/', protect, getCourses)
router.post('/', protect, authorize('instructor', 'admin'), validate(courseSchema), createCourse)
router.get('/:id/learn', protect, getLearningCourse)
router.get('/:id', protect, getCourseById)
router.patch('/:id', protect, authorize('instructor', 'admin'), validate(updateCourseSchema), updateCourse)
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse)
router.post('/:id/sections', protect, authorize('instructor', 'admin'), validate(sectionSchema), addCourseSection)
router.patch(
  '/:id/sections/:sectionIndex',
  protect,
  authorize('instructor', 'admin'),
  validate(sectionSchema),
  updateCourseSection
)
router.delete('/:id/sections/:sectionIndex', protect, authorize('instructor', 'admin'), deleteCourseSection)
router.post(
  '/:id/sections/:sectionIndex/lectures',
  protect,
  authorize('instructor', 'admin'),
  validate(lectureSchema),
  addCourseLecture
)
router.patch(
  '/:id/sections/:sectionIndex/lectures/:lectureIndex',
  protect,
  authorize('instructor', 'admin'),
  validate(updateLectureSchema),
  updateCourseLecture
)
router.delete(
  '/:id/sections/:sectionIndex/lectures/:lectureIndex',
  protect,
  authorize('instructor', 'admin'),
  deleteCourseLecture
)
router.post(
  '/:id/sections/:sectionIndex/lectures/:lectureIndex/video',
  protect,
  authorize('instructor', 'admin'),
  uploadLectureVideo.single('video'),
  uploadCourseLectureVideo
)

export default router
