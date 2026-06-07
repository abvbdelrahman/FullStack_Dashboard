import CalendarEvent from '../models/CalendarEvent.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const formatEvent = (event) => ({
  id: event._id,
  date: event.date,
  title: event.title,
  category: event.category || undefined,
  notes: event.notes || undefined,
})

export const getCalendarEvents = asyncHandler(async (req, res) => {
  const events = await CalendarEvent.find({ user: req.user._id }).sort({ date: 1, createdAt: 1 })
  res.json(events.map(formatEvent))
})

export const createCalendarEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.create({
    ...req.body,
    user: req.user._id,
  })

  res.status(201).json(formatEvent(event))
})

export const deleteCalendarEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  })

  if (!event) throw new AppError('Calendar event not found', 404)

  res.json({ success: true })
})
