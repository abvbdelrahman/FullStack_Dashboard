import React, { useEffect, useState } from 'react'
import { classAPI } from '../../services/workspaceApi'
import type { ClassSession } from '../../data/workspace'

type ManagedClass = {
  id: string
  title: string
  hours: string
  lessons: string
  type: string
  active: boolean
}

const formatSession = (session: ClassSession, index: number): ManagedClass => ({
  id: session.id,
  title: session.title,
  hours: session.duration || session.time,
  lessons: session.course,
  type: session.status,
  active: index === 0,
})

const RecentClassesCard: React.FC = () => {
  const [courses, setCourses] = useState<ManagedClass[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchClasses = async () => {
      try {
        const sessions = await classAPI.getAll()
        if (mounted) setCourses(sessions.slice(0, 4).map(formatSession))
      } catch {
        if (mounted) setCourses([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchClasses()
    return () => {
      mounted = false
    }
  }, [])

  const handleClick = (id: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, active: !c.active } : { ...c, active: false },
      ),
    )
  }

  const clearSelection = () => {
    setCourses((prev) => prev.map((c) => ({ ...c, active: false })))
  }

  return (
    <article className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Recent managed classes</h2>
        </div>
        <button
          type="button"
          onClick={clearSelection}
          className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700"
          aria-label="Show all classes"
          title="Show all"
        >
          All
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-slate-500">Loading classes...</p>
        ) : courses.map((course) => (
          <button
            key={course.id}
            onClick={() => handleClick(course.id)}
            className={`w-full text-left flex items-center gap-4 rounded-3xl border p-4 ${
              course.active ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-slate-50'
            }`}
            aria-pressed={course.active}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white shadow-sm text-slate-700">
              <span className="text-lg">{course.title.split(' ').slice(0,2).map(w=>w[0]).join('')}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{course.title}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                <span>{course.hours}</span>
                <span>{course.lessons}</span>
                <span>{course.type}</span>
              </div>
            </div>
          </button>
        ))}

        {!loading && courses.length === 0 && (
          <p className="text-sm text-slate-500">No recent classes found.</p>
        )}
      </div>
    </article>
  )
}

export default RecentClassesCard
