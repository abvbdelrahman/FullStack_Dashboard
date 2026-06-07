import { useEffect, useMemo, useState } from 'react'
import ScheduleCalendarCard from '../components/calender/ScheduleCalendarCard'
import { calendarService } from '../services/calendarService'
import type { CalendarEvent } from '../data/calendarEvents'

const today = new Date()
const todayKey = today.toISOString().slice(0, 10)

const parseEventDate = (value: string) => new Date(`${value}T00:00:00`)

const getWeekStart = (date: Date) => {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  copy.setDate(copy.getDate() - copy.getDay())
  return copy
}

const Schedule = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'Monthly' | 'Weekly' | 'Daily'>('Monthly')
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'All' | string>('All')
  const [addEventOpen, setAddEventOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState(todayKey)
  const [newCategory, setNewCategory] = useState('')
  const [newNotes, setNewNotes] = useState('')

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        const data = await calendarService.getEvents()
        setEvents(data)
        setError(null)
      } catch (err) {
        console.error('Error loading schedule events:', err)
        setError(err instanceof Error ? err.message : 'Failed to load schedule events')
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(events.map((event) => event.category).filter(Boolean) as string[]))],
    [events],
  )

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter
        const query = searchFilter.trim().toLowerCase()
        const matchesSearch =
          !query ||
          event.title.toLowerCase().includes(query) ||
          (event.notes?.toLowerCase().includes(query) ?? false)
        return matchesCategory && matchesSearch
      }),
    [events, categoryFilter, searchFilter],
  )

  const weeklyEvents = useMemo(() => {
    const start = getWeekStart(today)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return filteredEvents.filter((event) => {
      const eventDate = parseEventDate(event.date)
      return eventDate >= start && eventDate <= end
    })
  }, [filteredEvents])

  const dailyEvents = useMemo(
    () => filteredEvents.filter((event) => event.date === todayKey),
    [filteredEvents],
  )

  const addNewEvent = async () => {
    if (!newTitle.trim() || !newDate) {
      return
    }

    const nextEvent = {
      title: newTitle.trim(),
      date: newDate,
      category: newCategory || undefined,
      notes: newNotes.trim() || undefined,
    }

    try {
      const createdEvent = await calendarService.createEvent(nextEvent)
      setEvents((prev) => [createdEvent, ...prev])
      setAddEventOpen(false)
      setNewTitle('')
      setNewDate(todayKey)
      setNewCategory('')
      setNewNotes('')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add schedule event')
    }
  }

  const subtitle =
    view === 'Weekly'
      ? "See this week's schedule and upcoming events."
      : view === 'Daily'
      ? "Focus on today's events and tasks."
      : 'View and manage your schedule with a clean monthly layout.'

  return (
    <div className="p-6">
      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
            <p className="mt-2 text-slate-500">{subtitle}</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="rounded-full bg-slate-100 p-1 flex items-center gap-1 text-sm text-slate-600">
              {(['Monthly', 'Weekly', 'Daily'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setView(tab)}
                  className={`rounded-full px-4 py-2 transition ${
                    view === tab ? 'bg-orange-500 text-white' : 'hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setFilterOpen((prev) => !prev)}
              className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Filter
            </button>
            <button
              type="button"
              onClick={() => setAddEventOpen(true)}
              className="rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              + Add Event
            </button>
          </div>
        </div>

        {filterOpen && (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-sm font-semibold text-slate-900">Filter events</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="space-y-2 text-sm text-slate-700">
                Search
                <input
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search title or notes"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Category
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex items-end justify-end">
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {addEventOpen && (
          <div className="mt-6 rounded-3xl border border-orange-200 bg-orange-50 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Add event</h2>
                <p className="mt-1 text-sm text-slate-600">Create a new schedule item that appears in the calendar.</p>
              </div>
              <button
                type="button"
                onClick={() => setAddEventOpen(false)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Title
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Event title"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Date
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Category
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Review, Live, etc."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                Notes
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Add event notes"
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAddEventOpen(false)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addNewEvent}
                className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Save event
              </button>
            </div>
          </div>
        )}
      </section>

      {loading ? (
        <div className="mt-6 rounded-4xl border border-slate-200 bg-white p-8 shadow-sm text-slate-600">
          Loading schedule...
        </div>
      ) : error ? (
        <div className="mt-6 rounded-4xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {view === 'Monthly' ? (
            <ScheduleCalendarCard events={filteredEvents} />
          ) : view === 'Weekly' ? (
            <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Weekly view</h2>
              <p className="mt-2 text-slate-500">Events for the current week.</p>
              {weeklyEvents.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-6 text-slate-500">
                  No events scheduled for this week.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {weeklyEvents.map((event) => (
                    <div key={event.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
                          <p className="text-sm text-slate-600">{event.date}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                          {event.category || 'Event'}
                        </span>
                      </div>
                      {event.notes && <p className="mt-3 text-sm text-slate-600">{event.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Daily view</h2>
              <p className="mt-2 text-slate-500">Events for today ({todayKey}).</p>
              {dailyEvents.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-6 text-slate-500">
                  No events scheduled for today.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {dailyEvents.map((event) => (
                    <div key={event.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
                          <p className="text-sm text-slate-600">{event.category || 'Event'}</p>
                        </div>
                      </div>
                      {event.notes && <p className="mt-3 text-sm text-slate-600">{event.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Schedule
