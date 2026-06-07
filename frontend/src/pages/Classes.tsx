import { useMemo, useState, useEffect } from 'react'
import type { ClassSession } from '../data/workspace'
import { classAPI } from '../services/workspaceApi'

type SessionStatus = 'All' | 'Upcoming' | 'Live' | 'Completed'

const statuses: SessionStatus[] = ['All', 'Upcoming', 'Live', 'Completed']
const Classes = () => {
  const [status, setStatus] = useState<SessionStatus>('All')
  const [storedSessions, setStoredSessions] = useState<ClassSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newCourse, setNewCourse] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await classAPI.getAll()
        setStoredSessions(data)
        setError(null)
      } catch (err) {
        setStoredSessions([])
        setError(err instanceof Error ? err.message : 'Failed to load classes')
      }
    }

    loadSessions()
  }, [])

  const sessions = useMemo(
    () => storedSessions.filter((session) => status === 'All' || session.status === status),
    [status, storedSessions],
  )

  const openSession = (session: ClassSession) => {
    setActiveSessionId(session.id)
    setStoredSessions((currentSessions) => [
      session,
      ...currentSessions.filter((currentSession) => currentSession.id !== session.id),
    ])

    if (session.status === 'Live') {
      setMessage(`${session.title} workspace opened.`)
      return
    }

    if (session.status === 'Upcoming') {
      setMessage(`${session.title} details are ready for planning.`)
      return
    }

    setMessage(`${session.title} recording selected.`)
  }

  const addSession = async () => {
    if (!newTitle.trim()) return

    const session = await classAPI.create({
      title: newTitle.trim(),
      course: newCourse.trim() || 'General',
      instructor: 'Current instructor',
      date: new Date().toISOString().slice(0, 10),
      time: '10:00 AM',
      duration: '60 min',
      status: 'Upcoming',
    })
    setStoredSessions((currentSessions) => [session, ...currentSessions])
    setNewTitle('')
    setNewCourse('')
    setMessage(`${session.title} created.`)
  }

  const deleteSession = async (session: ClassSession) => {
    await classAPI.delete(session.id)
    setStoredSessions((currentSessions) => currentSessions.filter((item) => item.id !== session.id))
  }

  return (
    <div className="p-6">
      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Classes</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Track live sessions, upcoming classes, and completed workshops.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 rounded-full bg-slate-100 p-1">
            {statuses.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  status === item ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4">
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              placeholder="Class title"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
            />
            <input
              value={newCourse}
              onChange={(event) => setNewCourse(event.target.value)}
              placeholder="Course"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
            />
            <button
              type="button"
              onClick={addSession}
              className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Add class
            </button>
          </div>
        </div>
        {message && (
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}
        {sessions.map((session) => (
          <article
            key={session.id}
            className={`rounded-4xl border bg-white p-6 shadow-sm ${
              activeSessionId === session.id ? 'border-orange-300' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  session.status === 'Live'
                    ? 'bg-emerald-50 text-emerald-600'
                    : session.status === 'Upcoming'
                    ? 'bg-orange-50 text-orange-600'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {session.status}
                </span>
                <h2 className="mt-4 text-xl font-bold text-slate-900">{session.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{session.course} with {session.instructor}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 xl:w-[460px]">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <span className="text-xs text-slate-400">Date</span>
                  <p className="mt-1 font-semibold text-slate-800">{session.date}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <span className="text-xs text-slate-400">Time</span>
                  <p className="mt-1 font-semibold text-slate-800">{session.time}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <span className="text-xs text-slate-400">Duration</span>
                  <p className="mt-1 font-semibold text-slate-800">{session.duration}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openSession(session)}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-500"
              >
                {session.status === 'Completed' ? 'View recording' : session.status === 'Live' ? 'Open class' : 'View details'}
              </button>
              <button
                type="button"
                onClick={() => deleteSession(session)}
                className="rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-center text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

export default Classes
