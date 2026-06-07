import { useEffect, useMemo, useState } from 'react'
import type { ClassSession } from '../data/workspace'
import { resolveApiUrl } from '../services/api'
import { classAPI } from '../services/workspaceApi'

const Recordings = () => {
  const [query, setQuery] = useState('')
  const [recordings, setRecordings] = useState<ClassSession[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newCourse, setNewCourse] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRecordings = async () => {
      try {
        const sessions = await classAPI.getAll()
        setRecordings(sessions.filter((session) => session.status === 'Completed' && session.recordingUrl))
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recordings')
      }
    }

    loadRecordings()
  }, [])

  const filteredRecordings = useMemo(() => {
    const search = query.trim().toLowerCase()
    return recordings.filter(
      (recording) =>
        !search ||
        recording.title.toLowerCase().includes(search) ||
        recording.course.toLowerCase().includes(search) ||
        recording.instructor.toLowerCase().includes(search),
    )
  }, [query, recordings])

  const addRecording = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return

    try {
      const recording = await classAPI.create({
        title: newTitle.trim(),
        course: newCourse.trim() || 'General',
        instructor: 'Current instructor',
        date: new Date().toISOString().slice(0, 10),
        time: 'Recorded',
        duration: '',
        status: 'Completed',
        recordingUrl: newUrl.trim(),
      })
      setRecordings((currentRecordings) => [recording, ...currentRecordings])
      setNewTitle('')
      setNewCourse('')
      setNewUrl('')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add recording')
    }
  }

  const deleteRecording = async (id: string) => {
    try {
      await classAPI.delete(id)
      setRecordings((currentRecordings) => currentRecordings.filter((recording) => recording.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recording')
    }
  }

  return (
    <div className="p-6">
      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Recordings</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Manage completed class recordings and replay links.
            </p>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search recordings"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 sm:max-w-xs"
          />
        </div>
      </section>

      <section className="mt-6 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="Recording title"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
          />
          <input
            value={newCourse}
            onChange={(event) => setNewCourse(event.target.value)}
            placeholder="Course"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
          />
          <input
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
            placeholder="Recording URL"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
          />
          <button
            type="button"
            onClick={addRecording}
            className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Add recording
          </button>
        </div>
        {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {filteredRecordings.length === 0 ? (
          <div className="rounded-4xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm lg:col-span-2">
            No recordings match your search.
          </div>
        ) : (
          filteredRecordings.map((recording) => (
            <article key={recording.id} className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
              <div className="aspect-video bg-slate-950">
                <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-300">
                  Recording preview
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900">{recording.title}</h2>
                <p className="mt-2 text-sm text-slate-500">{recording.course}</p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span>{recording.instructor}</span>
                  <span>{recording.date}</span>
                  {recording.duration && <span>{recording.duration}</span>}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={resolveApiUrl(recording.recordingUrl || '')}
                    className="inline-flex rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Watch recording
                  </a>
                  <button
                    type="button"
                    onClick={() => deleteRecording(recording.id)}
                    className="rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  )
}

export default Recordings
