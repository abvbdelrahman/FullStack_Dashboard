import { Router } from 'express'
import {
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvents,
} from '../controllers/calendarController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { calendarEventSchema } from '../schemas/calendarSchemas.js'

const router = Router()

router.use(protect)
router.get('/', getCalendarEvents)
router.post('/', validate(calendarEventSchema), createCalendarEvent)
router.delete('/:id', deleteCalendarEvent)

export default router
