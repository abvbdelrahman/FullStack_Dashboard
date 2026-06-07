import { useEffect, useMemo, useState } from 'react'
import { noteAPI, type NoteItem } from '../services/workspaceApi'

const Notes = () => {
  const [notes, setNotes] = useState<NoteItem[]>([])
  const [query, setQuery] = useState('')
  const [title, setTitle] = useState('')
  const [course, setCourse] = useState('')
  const [body, setBody] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true)
        setNotes(await noteAPI.getAll())
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load notes')
      } finally {
        setLoading(false)
      }
    }

    loadNotes()
  }, [])

  const filteredNotes = useMemo(() => {
    const search = query.trim().toLowerCase()
    return notes.filter(
      (note) =>
        !search ||
        note.title.toLowerCase().includes(search) ||
        note.course.toLowerCase().includes(search) ||
        note.body.toLowerCase().includes(search),
    )
  }, [notes, query])

  const resetForm = () => {
    setTitle('')
    setCourse('')
    setBody('')
    setEditingId(null)
  }

  const saveNote = async () => {
    if (!title.trim() || !body.trim()) return

    try {
      const payload = {
        title: title.trim(),
        course: course.trim() || 'General',
        body: body.trim(),
      }

      if (editingId) {
        const note = await noteAPI.update(editingId, payload)
        setNotes((currentNotes) => currentNotes.map((currentNote) => (currentNote.id === note.id ? note : currentNote)))
      } else {
        const note = await noteAPI.create(payload)
        setNotes((currentNotes) => [note, ...currentNotes])
      }

      resetForm()
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note')
    }
  }

  const editNote = (note: NoteItem) => {
    setEditingId(note.id)
    setTitle(note.title)
    setCourse(note.course)
    setBody(note.body)
  }

  const deleteNote = async (id: string) => {
    try {
      await noteAPI.delete(id)
      setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note')
    }
  }

  return (
    <div className="p-6">
      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Notes</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Capture study notes and keep them organized by course.
            </p>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notes"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 sm:max-w-xs"
          />
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit note' : 'New note'}</h2>
          <div className="mt-5 space-y-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Title"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
            />
            <input
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              placeholder="Course"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
            />
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Write your note"
              rows={7}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
            />
            <button
              type="button"
              onClick={saveNote}
              className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              {editingId ? 'Save note' : 'Add note'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel edit
              </button>
            )}
          </div>
        </section>

        <section className="grid gap-4">
          {loading ? (
            <div className="rounded-4xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
              Loading notes...
            </div>
          ) : error ? (
            <div className="rounded-4xl border border-red-200 bg-red-50 p-8 text-red-700 shadow-sm">
              {error}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="rounded-4xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
              No notes found.
            </div>
          ) : (
            filteredNotes.map((note) => (
              <article key={note.id} className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{note.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{note.course} · Updated {note.updatedAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editNote(note)}
                      className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteNote(note.id)}
                      className="rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-5 leading-7 text-slate-600">{note.body}</p>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  )
}

export default Notes
