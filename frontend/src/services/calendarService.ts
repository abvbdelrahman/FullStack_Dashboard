import type { CalendarEvent } from '../data/calendarEvents'
import { calendarAPI } from './api'

export const calendarService = {
  async getEvents(): Promise<CalendarEvent[]> {
    try {
      const events = await calendarAPI.getEvents()
      return events as CalendarEvent[]
    } catch {
      return []
    }
  },

  async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const createdEvent = await calendarAPI.createEvent(event)
    return createdEvent as CalendarEvent
  },
}
