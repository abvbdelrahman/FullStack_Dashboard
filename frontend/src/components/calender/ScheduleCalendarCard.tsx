import { useMemo, useState } from 'react'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const getMonthDays = (year: number, month: number) => {
  const firstDayIndex = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: firstDayIndex }, () => null)
  return [...days, ...Array.from({ length: daysInMonth }, (_, idx) => idx + 1)]
}

type CalEvent = {
  id: string
  date: string // YYYY-MM-DD
  title: string
  category?: string
  notes?: string
}

const formatDateKey = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

const categoryColor = {
  Review: 'bg-rose-100 text-rose-700',
  Live: 'bg-emerald-100 text-emerald-700',
  Workshop: 'bg-cyan-100 text-cyan-700',
  Planning: 'bg-orange-100 text-orange-700',
  Meeting: 'bg-violet-100 text-violet-700',
  default: 'bg-slate-100 text-slate-700',
}

type Props = {
  events?: CalEvent[]
  onSelectDate?: (date: Date) => void
  locale?: string
}

const ScheduleCalendarCard = ({
  events = [],
  onSelectDate,
  locale = 'en-US',
}: Props) => {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(today)
  const [displayedMonth, setDisplayedMonth] = useState(today.getMonth())
  const [displayedYear, setDisplayedYear] = useState(today.getFullYear())

  const monthName = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, { month: 'long' }).format(
        new Date(displayedYear, displayedMonth),
      ),
    [displayedMonth, displayedYear, locale],
  )

  const days = useMemo(
    () => getMonthDays(displayedYear, displayedMonth),
    [displayedMonth, displayedYear],
  )

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalEvent[]>()
    for (const ev of events) {
      const list = map.get(ev.date) ?? []
      list.push(ev)
      map.set(ev.date, list)
    }
    return map
  }, [events])

  const changeMonth = (delta: number) => {
    const newDate = new Date(displayedYear, displayedMonth + delta, 1)
    setDisplayedMonth(newDate.getMonth())
    setDisplayedYear(newDate.getFullYear())
  }

  const handleSelect = (day: number) => {
    const d = new Date(displayedYear, displayedMonth, day)
    setSelectedDate(d)
    onSelectDate?.(d)
  }

  const selectedDateKey = formatDateKey(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
  )
  const selectedEvents = eventsByDate.get(selectedDateKey) ?? []

  return (
    <article className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm font-semibold text-slate-900">
        <span>{monthName} {displayedYear}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedDate(new Date())}
            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-slate-600"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-3 text-center text-xs text-slate-500">
        {weekDays.map((day) => (
          <span key={day} className="font-semibold text-slate-500">
            {day}
          </span>
        ))}

        {days.map((day, index) => {
          if (day === null) {
            return <span key={`empty-${index}`} />
          }

          const isToday =
            day === today.getDate() &&
            displayedMonth === today.getMonth() &&
            displayedYear === today.getFullYear()

          const isSelected =
            day === selectedDate.getDate() &&
            displayedMonth === selectedDate.getMonth() &&
            displayedYear === selectedDate.getFullYear()

          const dateKey = formatDateKey(displayedYear, displayedMonth, day)
          const dayEvents = eventsByDate.get(dateKey) ?? []

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => handleSelect(day)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleSelect(day)
                }
              }}
              aria-label={`Select ${monthName} ${day}, ${displayedYear}`}
              className={`group h-28 rounded-3xl border p-3 text-left transition ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 text-slate-900 shadow-sm'
                  : isToday
                  ? 'border-orange-300 bg-orange-50/50 text-orange-700'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between text-sm">
                <span>{day}</span>
                {dayEvents.length > 0 && <span className="h-2.5 w-2.5 rounded-full bg-orange-500" aria-hidden />}
              </div>
              <div className="mt-2 space-y-1 text-[10px]">
                {dayEvents.slice(0, 2).map((ev) => (
                  <div
                    key={ev.id}
                    className={`overflow-hidden rounded-2xl px-2 py-1 font-semibold leading-tight ${
                      (ev.category ? categoryColor[ev.category as keyof typeof categoryColor] : categoryColor.default) ?? categoryColor.default
                    }`}
                  >
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[10px] text-slate-400">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold">Events on {selectedDate.toLocaleDateString(locale)}</h4>
        <div className="mt-3 space-y-3 text-sm text-slate-600">
          {(eventsByDate.get(formatDateKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())) ?? []).length === 0 ? (
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4 text-slate-400">No events</div>
          ) : (
            selectedEvents.map((ev) => (
              <div key={ev.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-900">{ev.title}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] uppercase tracking-[0.15em] text-slate-500">
                    {ev.category || 'Event'}
                  </span>
                </div>
                {ev.notes && <p className="mt-2 text-sm text-slate-500">{ev.notes}</p>}
              </div>
            ))
          )}

        </div>
      </div>
    </article>
  )
}

export default ScheduleCalendarCard
