export type CalendarEvent = {
  id: string
  date: string // YYYY-MM-DD
  title: string
  category?: string
  notes?: string
}

const today = new Date()
const currentYear = today.getFullYear()
const currentMonth = String(today.getMonth() + 1).padStart(2, '0')

const eventDay = (day: number) => `${currentYear}-${currentMonth}-${String(day).padStart(2, '0')}`

export const calendarEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    date: eventDay(8),
    title: 'Design Review',
    category: 'Review',
    notes: 'Prepare the final slide deck and share feedback.',
  },
  {
    id: 'event-2',
    date: eventDay(10),
    title: 'Course Discussion',
    category: 'Live',
    notes: 'Discuss the final project requirements.',
  },
  {
    id: 'event-3',
    date: eventDay(14),
    title: 'Market Research Session',
    category: 'Workshop',
    notes: 'Review competitor data and design direction.',
  },
  {
    id: 'event-4',
    date: eventDay(22),
    title: 'Sprint Planning',
    category: 'Planning',
    notes: "Break down next week's tasks.",
  },
  {
    id: 'event-5',
    date: eventDay(28),
    title: 'New Deals Review',
    category: 'Meeting',
    notes: 'Finalize the new course onboarding flow.',
  },
]
