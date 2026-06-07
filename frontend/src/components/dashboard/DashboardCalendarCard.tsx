import { useMemo, useState } from 'react'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const getMonthDays = (year: number, month: number) => {
  const firstDayIndex = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: firstDayIndex }, () => null)
  return [...days, ...Array.from({ length: daysInMonth }, (_, index) => index + 1)]
}

type CalEvent = { id: string; date: string; title: string }

const formatDateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

const DashboardCalendarCard = ({
  events = [],
  onSelectDate,
  locale = 'en-US',
}: {
  events?: CalEvent[]
  onSelectDate?: (date: Date) => void
  locale?: string
}) => {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(today)
  const [displayedMonth, setDisplayedMonth] = useState(today.getMonth())
  const [displayedYear, setDisplayedYear] = useState(today.getFullYear())

  const monthName = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(displayedYear, displayedMonth)),
    [displayedMonth, displayedYear, locale],
  )

  const days = useMemo(
    () => getMonthDays(displayedYear, displayedMonth),
    [displayedMonth, displayedYear],
  )

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalEvent[]>()
    for (const event of events) {
      const list = map.get(event.date) ?? []
      list.push(event)
      map.set(event.date, list)
    }
    return map
  }, [events])

  const selectedDateKey = formatDateKey(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
  )
  const selectedEvents = eventsByDate.get(selectedDateKey) ?? []

  const changeMonth = (delta: number) => {
    const newDate = new Date(displayedYear, displayedMonth + delta, 1)
    setDisplayedMonth(newDate.getMonth())
    setDisplayedYear(newDate.getFullYear())
  }

  const handleSelect = (day: number) => {
    const date = new Date(displayedYear, displayedMonth, day)
    setSelectedDate(date)
    onSelectDate?.(date)
  }

  return (
    <article className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
        <span>{monthName} {displayedYear}</span>
        <div className="flex items-center gap-3 text-slate-500">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1"
          >
            {'<'}
          </button>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1"
          >
            {'>'}
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
        {weekDays.map((day) => (
          <span key={day} className="font-semibold text-slate-500">
            {day}
          </span>
        ))}

        {days.map((day, index) => {
          if (day === null) return <span key={`empty-${index}`} />

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
              aria-label={`Select ${monthName} ${day}, ${displayedYear}`}
              className={`w-full rounded-2xl py-2 transition ${
                isSelected
                  ? 'bg-orange-500 text-white'
                  : isToday
                    ? 'border border-orange-500 text-orange-600'
                    : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex flex-col items-center">
                <span>{day}</span>
                {dayEvents.length > 0 && <span className="mt-1 h-1 w-1 rounded-full bg-orange-500" />}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-semibold">Events on {selectedDate.toLocaleDateString(locale)}</h4>
        <div className="mt-2 space-y-2 text-sm text-slate-600">
          {selectedEvents.length === 0 ? (
            <div className="text-slate-400">No events</div>
          ) : (
            selectedEvents.map((event) => (
              <div key={event.id} className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                {event.title}
              </div>
            ))
          )}
        </div>
      </div>
    </article>
  )
}

export default DashboardCalendarCard
