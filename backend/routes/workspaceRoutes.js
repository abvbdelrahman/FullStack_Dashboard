import { Router } from 'express'
import {
  addDiscussionReply,
  createClassSession,
  createDiscussion,
  createNote,
  createNotification,
  createResource,
  createTask,
  deleteClassSession,
  deleteDiscussion,
  deleteNote,
  deleteNotification,
  deleteResource,
  deleteTask,
  getClassSessions,
  getDashboardSummary,
  getDiscussions,
  getNotes,
  getNotifications,
  getResources,
  getSettings,
  getTasks,
  markAllNotificationsRead,
  updateClassSession,
  updateDiscussion,
  updateNote,
  updateNotification,
  updateResource,
  updateSettings,
  updateTask,
} from '../controllers/workspaceController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  classSessionSchema,
  dashboardTaskSchema,
  discussionSchema,
  noteSchema,
  notificationSchema,
  replySchema,
  resourceSchema,
  settingsSchema,
} from '../schemas/workspaceSchemas.js'

const router = Router()

router.use(protect)

router.get('/dashboard', getDashboardSummary)

router.get('/notes', getNotes)
router.post('/notes', validate(noteSchema), createNote)
router.patch('/notes/:id', validate(noteSchema.partial()), updateNote)
router.delete('/notes/:id', deleteNote)

router.get('/resources', getResources)
router.post('/resources', validate(resourceSchema), createResource)
router.patch('/resources/:id', validate(resourceSchema.partial()), updateResource)
router.delete('/resources/:id', deleteResource)

router.get('/classes', getClassSessions)
router.post('/classes', validate(classSessionSchema), createClassSession)
router.patch('/classes/:id', validate(classSessionSchema.partial()), updateClassSession)
router.delete('/classes/:id', deleteClassSession)

router.get('/discussions', getDiscussions)
router.post('/discussions', validate(discussionSchema), createDiscussion)
router.patch('/discussions/:id', validate(discussionSchema.partial()), updateDiscussion)
router.delete('/discussions/:id', deleteDiscussion)
router.post('/discussions/:id/replies', validate(replySchema), addDiscussionReply)

router.get('/settings', getSettings)
router.patch('/settings', validate(settingsSchema), updateSettings)

router.get('/tasks', getTasks)
router.post('/tasks', validate(dashboardTaskSchema), createTask)
router.patch('/tasks/:id', validate(dashboardTaskSchema.partial()), updateTask)
router.delete('/tasks/:id', deleteTask)

router.get('/notifications', getNotifications)
router.post('/notifications', validate(notificationSchema), createNotification)
router.patch('/notifications/read-all', markAllNotificationsRead)
router.patch('/notifications/:id', validate(notificationSchema.partial()), updateNotification)
router.delete('/notifications/:id', deleteNotification)

export default router
