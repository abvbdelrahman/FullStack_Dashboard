import ClassSession from '../models/ClassSession.js'
import Course from '../models/Course.js'
import Assignment from '../models/Assignment.js'
import DashboardTask from '../models/DashboardTask.js'
import Discussion from '../models/Discussion.js'
import Note from '../models/Note.js'
import Notification from '../models/Notification.js'
import Resource from '../models/Resource.js'
import User from '../models/User.js'
import UserSettings from '../models/UserSettings.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { normalizeDemoUrl } from '../utils/demoDownloads.js'

const formatNote = (note) => ({
  id: note._id,
  title: note.title,
  course: note.course,
  body: note.body,
  updatedAt: note.updatedAt.toISOString().slice(0, 10),
})

const formatResource = (resource) => ({
  id: resource._id,
  title: resource.title,
  course: resource.course,
  kind: resource.kind,
  size: resource.size,
  url: normalizeDemoUrl(resource.url),
  saved: resource.saved,
  updatedAt: resource.updatedAt.toISOString().slice(0, 10),
})

const formatClassSession = (session) => ({
  id: session._id,
  title: session.title,
  course: session.course,
  instructor: session.instructor,
  date: session.date,
  time: session.time,
  duration: session.duration,
  status: session.status,
  recordingUrl: normalizeDemoUrl(session.recordingUrl) || undefined,
})

const formatDiscussion = (discussion) => ({
  id: discussion._id,
  title: discussion.title,
  course: discussion.course,
  author: discussion.author,
  replies: discussion.replies.length,
  lastActivity: discussion.updatedAt.toISOString(),
  tags: discussion.tags,
  excerpt: discussion.excerpt,
  replyItems: discussion.replies.map((reply) => ({
    id: reply._id,
    author: reply.author,
    body: reply.body,
    createdAt: reply.createdAt,
  })),
})

const formatTask = (task) => ({
  id: task._id,
  title: task.title,
  date: task.date,
  done: task.done,
})

const formatNotification = (notification) => ({
  id: notification._id,
  title: notification.title,
  description: notification.description,
  time: notification.time,
  read: notification.read,
})

const getOwnedDocument = async (Model, userId, id, message) => {
  const document = await Model.findOne({ _id: id, user: userId })
  if (!document) throw new AppError(message, 404)
  return document
}

export const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 })
  res.json(notes.map(formatNote))
})

export const createNote = asyncHandler(async (req, res) => {
  const note = await Note.create({ ...req.body, user: req.user._id })
  res.status(201).json(formatNote(note))
})

export const updateNote = asyncHandler(async (req, res) => {
  const note = await getOwnedDocument(Note, req.user._id, req.params.id, 'Note not found')
  Object.assign(note, req.body)
  await note.save()
  res.json(formatNote(note))
})

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await getOwnedDocument(Note, req.user._id, req.params.id, 'Note not found')
  await Note.deleteOne({ _id: note._id })
  res.json({ success: true })
})

export const getResources = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id }
  if (req.query.saved === 'true') filter.saved = true
  const resources = await Resource.find(filter).sort({ updatedAt: -1 })
  res.json(resources.map(formatResource))
})

export const createResource = asyncHandler(async (req, res) => {
  const resource = await Resource.create({ ...req.body, user: req.user._id })
  res.status(201).json(formatResource(resource))
})

export const updateResource = asyncHandler(async (req, res) => {
  const resource = await getOwnedDocument(Resource, req.user._id, req.params.id, 'Resource not found')
  Object.assign(resource, req.body)
  await resource.save()
  res.json(formatResource(resource))
})

export const deleteResource = asyncHandler(async (req, res) => {
  const resource = await getOwnedDocument(Resource, req.user._id, req.params.id, 'Resource not found')
  await Resource.deleteOne({ _id: resource._id })
  res.json({ success: true })
})

export const getClassSessions = asyncHandler(async (req, res) => {
  const sessions = await ClassSession.find({ user: req.user._id }).sort({ date: 1, createdAt: 1 })
  res.json(sessions.map(formatClassSession))
})

export const createClassSession = asyncHandler(async (req, res) => {
  const session = await ClassSession.create({ ...req.body, user: req.user._id })
  res.status(201).json(formatClassSession(session))
})

export const updateClassSession = asyncHandler(async (req, res) => {
  const session = await getOwnedDocument(ClassSession, req.user._id, req.params.id, 'Class not found')
  Object.assign(session, req.body)
  await session.save()
  res.json(formatClassSession(session))
})

export const deleteClassSession = asyncHandler(async (req, res) => {
  const session = await getOwnedDocument(ClassSession, req.user._id, req.params.id, 'Class not found')
  await ClassSession.deleteOne({ _id: session._id })
  res.json({ success: true })
})

export const getDiscussions = asyncHandler(async (req, res) => {
  const discussions = await Discussion.find({ user: req.user._id }).sort({ updatedAt: -1 })
  res.json(discussions.map(formatDiscussion))
})

export const createDiscussion = asyncHandler(async (req, res) => {
  const discussion = await Discussion.create({
    ...req.body,
    user: req.user._id,
    author: req.user.name,
  })
  res.status(201).json(formatDiscussion(discussion))
})

export const updateDiscussion = asyncHandler(async (req, res) => {
  const discussion = await getOwnedDocument(Discussion, req.user._id, req.params.id, 'Discussion not found')
  Object.assign(discussion, req.body)
  await discussion.save()
  res.json(formatDiscussion(discussion))
})

export const deleteDiscussion = asyncHandler(async (req, res) => {
  const discussion = await getOwnedDocument(Discussion, req.user._id, req.params.id, 'Discussion not found')
  await Discussion.deleteOne({ _id: discussion._id })
  res.json({ success: true })
})

export const addDiscussionReply = asyncHandler(async (req, res) => {
  const discussion = await getOwnedDocument(Discussion, req.user._id, req.params.id, 'Discussion not found')
  discussion.replies.push({ author: req.user.name, body: req.body.body })
  await discussion.save()
  res.status(201).json(formatDiscussion(discussion))
})

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await UserSettings.findOneAndUpdate(
    { user: req.user._id },
    { $setOnInsert: { user: req.user._id } },
    { new: true, upsert: true }
  )

  res.json({
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    weeklyDigest: settings.weeklyDigest,
    classReminders: settings.classReminders,
    compactMode: settings.compactMode,
  })
})

export const updateSettings = asyncHandler(async (req, res) => {
  const { name, email, weeklyDigest, classReminders, compactMode } = req.body

  if (name !== undefined || email !== undefined) {
    const update = {}
    if (name !== undefined) update.name = name
    if (email !== undefined) update.email = email
    await User.findByIdAndUpdate(req.user._id, update, { runValidators: true })
  }

  const settingsUpdate = {}
  if (weeklyDigest !== undefined) settingsUpdate.weeklyDigest = weeklyDigest
  if (classReminders !== undefined) settingsUpdate.classReminders = classReminders
  if (compactMode !== undefined) settingsUpdate.compactMode = compactMode

  await UserSettings.findOneAndUpdate(
    { user: req.user._id },
    { $set: settingsUpdate, $setOnInsert: { user: req.user._id } },
    { new: true, upsert: true }
  )

  req.user = await User.findById(req.user._id)
  return getSettings(req, res)
})

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await DashboardTask.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(tasks.map(formatTask))
})

export const createTask = asyncHandler(async (req, res) => {
  const task = await DashboardTask.create({ ...req.body, user: req.user._id })
  res.status(201).json(formatTask(task))
})

export const updateTask = asyncHandler(async (req, res) => {
  const task = await getOwnedDocument(DashboardTask, req.user._id, req.params.id, 'Task not found')
  Object.assign(task, req.body)
  await task.save()
  res.json(formatTask(task))
})

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await getOwnedDocument(DashboardTask, req.user._id, req.params.id, 'Task not found')
  await DashboardTask.deleteOne({ _id: task._id })
  res.json({ success: true })
})

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(notifications.map(formatNotification))
})

export const createNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create({ ...req.body, user: req.user._id })
  res.status(201).json(formatNotification(notification))
})

export const updateNotification = asyncHandler(async (req, res) => {
  const notification = await getOwnedDocument(Notification, req.user._id, req.params.id, 'Notification not found')
  Object.assign(notification, req.body)
  await notification.save()
  res.json(formatNotification(notification))
})

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { read: true })
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(notifications.map(formatNotification))
})

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await getOwnedDocument(Notification, req.user._id, req.params.id, 'Notification not found')
  await Notification.deleteOne({ _id: notification._id })
  res.json({ success: true })
})

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const courseFilter = req.user.role === 'admin' ? {} : { owner: req.user._id }
  const courses = await Course.find(courseFilter).select('_id totalLessons')
  const courseIds = courses.map((course) => course._id)
  const [assignments, classes, tasks, resources] = await Promise.all([
    Assignment.find({ course: { $in: courseIds } }),
    ClassSession.find({ user: req.user._id }),
    DashboardTask.find({ user: req.user._id }),
    Resource.find({ user: req.user._id, saved: true }),
  ])

  res.json({
    courses: courses.length,
    lessons: courses.reduce((total, course) => total + (course.totalLessons || 0), 0),
    assignments: assignments.length,
    pendingAssignments: assignments.filter((assignment) => assignment.status !== 'Done').length,
    classes: classes.length,
    upcomingClasses: classes.filter((session) => session.status !== 'Completed').length,
    tasks: tasks.length,
    openTasks: tasks.filter((task) => !task.done).length,
    savedResources: resources.length,
    hours: [
      { month: 'Jan', Teaching: Math.max(courses.length * 2, 1), Admin: Math.max(assignments.length, 1) },
      { month: 'Feb', Teaching: Math.max(courses.length * 3, 2), Admin: Math.max(assignments.length + 2, 2) },
      { month: 'Mar', Teaching: Math.max(courses.length * 4, 3), Admin: Math.max(tasks.length + 1, 2) },
      { month: 'Apr', Teaching: Math.max(classes.length * 2, 2), Admin: Math.max(resources.length + 1, 1) },
      { month: 'May', Teaching: Math.max(classes.length * 3, 3), Admin: Math.max(tasks.length, 1) },
    ],
  })
})
