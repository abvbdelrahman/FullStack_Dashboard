import { useEffect, useMemo, useState } from 'react'
import type { DiscussionThread } from '../data/workspace'
import { discussionAPI } from '../services/workspaceApi'

const Discussions = () => {
  const [threads, setThreads] = useState<DiscussionThread[]>([])
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState('All')
  const [selectedThreadId, setSelectedThreadId] = useState('')
  const [reply, setReply] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newExcerpt, setNewExcerpt] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadThreads = async () => {
      try {
        const data = await discussionAPI.getAll()
        setThreads(data)
        setSelectedThreadId(data[0]?.id ?? '')
        setError(null)
      } catch (err) {
        setThreads([])
        setSelectedThreadId('')
        setError(err instanceof Error ? err.message : 'Failed to load discussions')
      }
    }

    loadThreads()
  }, [])

  const courses = useMemo(
    () => ['All', ...Array.from(new Set(threads.map((thread) => thread.course)))],
    [threads],
  )

  const filteredThreads = useMemo(() => {
    const search = query.trim().toLowerCase()
    return threads.filter((thread) => {
      const matchesCourse = course === 'All' || thread.course === course
      const matchesSearch =
        !search ||
        thread.title.toLowerCase().includes(search) ||
        thread.excerpt.toLowerCase().includes(search) ||
        thread.tags.some((tag) => tag.toLowerCase().includes(search))
      return matchesCourse && matchesSearch
    })
  }, [course, query, threads])

  const selectedThread =
    filteredThreads.find((thread) => thread.id === selectedThreadId) ?? filteredThreads[0] ?? threads[0]

  const postReply = () => {
    if (!selectedThread || !reply.trim()) return

    discussionAPI.reply(selectedThread.id, reply.trim()).then((updatedThread) => {
      setThreads((currentThreads) =>
        currentThreads.map((thread) => (thread.id === updatedThread.id ? updatedThread : thread)),
      )
      setReply('')
      setMessage('Reply added to the discussion.')
    })
  }

  const addDiscussion = async () => {
    if (!newTitle.trim() || !newExcerpt.trim()) return

    const discussion = await discussionAPI.create({
      title: newTitle.trim(),
      course: 'General',
      tags: [],
      excerpt: newExcerpt.trim(),
    })
    setThreads((currentThreads) => [discussion, ...currentThreads])
    setSelectedThreadId(discussion.id)
    setNewTitle('')
    setNewExcerpt('')
  }

  const deleteDiscussion = async (id: string) => {
    await discussionAPI.delete(id)
    setThreads((currentThreads) => currentThreads.filter((thread) => thread.id !== id))
    setSelectedThreadId((currentId) => (currentId === id ? '' : currentId))
  }

  return (
    <div className="p-6">
      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Discussions</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Follow course questions, share feedback, and keep class conversations organized.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(220px,320px)_220px]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search discussions"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
            />
            <select
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
            >
              {courses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          </div>
        </section>
        {error && (
          <div className="mt-4 rounded-3xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[420px_1fr]">
        <section className="rounded-4xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 space-y-3 rounded-3xl bg-slate-50 p-4">
            <input
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              placeholder="New discussion title"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
            />
            <textarea
              value={newExcerpt}
              onChange={(event) => setNewExcerpt(event.target.value)}
              placeholder="Discussion content"
              rows={3}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
            />
            <button
              type="button"
              onClick={addDiscussion}
              className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Add discussion
            </button>
          </div>
          <div className="space-y-3">
            {filteredThreads.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-6 text-center text-slate-500">
                No discussions found.
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => {
                    setSelectedThreadId(thread.id)
                    setMessage(null)
                  }}
                  className={`w-full rounded-3xl border p-4 text-left transition ${
                    selectedThread?.id === thread.id
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <h2 className="font-bold text-slate-900">{thread.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{thread.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span>{thread.replies} replies</span>
                    <span>{thread.lastActivity}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
          {selectedThread ? (
            <>
              <div className="flex flex-wrap gap-2">
                {selectedThread.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-900">{selectedThread.title}</h2>
              <p className="mt-2 text-sm text-slate-500">
                {selectedThread.course} - Started by {selectedThread.author} - {selectedThread.lastActivity}
              </p>
              <p className="mt-6 leading-7 text-slate-600">{selectedThread.excerpt}</p>
              <button
                type="button"
                onClick={() => deleteDiscussion(selectedThread.id)}
                className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                Delete discussion
              </button>
              <div className="mt-8 rounded-3xl bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">Reply</h3>
                <textarea
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  rows={5}
                  placeholder="Write a reply"
                  className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={postReply}
                    disabled={!reply.trim()}
                    className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Post reply
                  </button>
                </div>
                {message && <p className="mt-3 text-sm font-medium text-emerald-600">{message}</p>}
              </div>
            </>
          ) : (
            <div className="text-center text-slate-500">Select a discussion to view details.</div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Discussions
