import { Router } from 'express'
import {
  createAssignment,
  deleteAssignment,
  getAssignmentById,
  getAssignments,
  getMyAssignments,
  submitAssignment,
  updateAssignment,
} from '../controllers/assignmentController.js'
import { authorize, protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  assignmentSchema,
  submitAssignmentSchema,
  updateAssignmentSchema,
} from '../schemas/assignmentSchemas.js'

const router = Router()

router.get('/', protect, authorize('instructor', 'admin'), getAssignments)
router.post('/', protect, authorize('instructor', 'admin'), validate(assignmentSchema), createAssignment)
router.get('/me', protect, getMyAssignments)
router.get('/:id', protect, authorize('instructor', 'admin'), getAssignmentById)
router.patch('/:id', protect, authorize('instructor', 'admin'), validate(updateAssignmentSchema), updateAssignment)
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteAssignment)
router.post('/:id/submit', protect, validate(submitAssignmentSchema), submitAssignment)

export default router
