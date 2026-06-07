import React, { useEffect, useState } from 'react'
import type { ClassSession } from '../../data/workspace'
import { classAPI } from '../../services/workspaceApi'

type Lesson = {
  id: string
  title: string
  time: string
  active: boolean
  opened: boolean
}

const formatLesson = (session: ClassSession, index: number): Lesson => ({
  id: session.id,
  title: session.title,
  time: `${session.date} · ${session.time}`,
  active: index === 0,
  opened: false,
})

const UpcomingLessonCard: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchLessons = async () => {
      try {
        const sessions = await classAPI.getAll()
        const upcoming = sessions.filter((session) => session.status !== 'Completed')
        if (mounted) setLessons(upcoming.slice(0, 4).map(formatLesson))
      } catch {
        if (mounted) setLessons([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchLessons()
    return () => {
      mounted = false
    }
  }, [])

  const selectLesson = (id: string) => {
    setLessons((prev) => prev.map((l) => ({ ...l, active: l.id === id })))
  }

  const openLesson = (id: string) => {
    setLessons((prev) => prev.map((l) => (l.id === id ? { ...l, opened: true, active: false } : l)))
  }

  const clearSelection = () => {
    setLessons((prev) => prev.map((l) => ({ ...l, active: false })))
  }

  return (
    <article className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-slate-900">Upcoming Lesson</div>
        <button
          type="button"
          onClick={clearSelection}
          className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700"
          title="Show all"
        >
          All
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-slate-500">Loading lessons...</p>
        ) : lessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`flex items-center justify-between rounded-3xl border p-4 ${
              lesson.active ? 'border-orange-500 bg-orange-50' : 'border-slate-100 bg-slate-50'
            }`}
          >
            <button
              type="button"
              onClick={() => selectLesson(lesson.id)}
              className="text-left flex-1"
              aria-pressed={lesson.active}
            >
              <p className={`font-semibold ${lesson.opened ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                {lesson.title}
              </p>
              <p className="text-sm text-slate-500">{lesson.time}</p>
            </button>

            <div className="ml-4">
              {lesson.opened ? (
                <button
                  type="button"
                  disabled
                  className="rounded-full px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-700"
                >
                  Opened
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openLesson(lesson.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    lesson.active ? 'bg-orange-500 text-white' : 'bg-white text-orange-500 border border-orange-200'
                  }`}
                >
                  Open
                </button>
              )}
            </div>
          </div>
        ))}

        {!loading && lessons.length === 0 && <p className="text-sm text-slate-500">No upcoming lessons.</p>}
      </div>
    </article>
  )
}

export default UpcomingLessonCard
