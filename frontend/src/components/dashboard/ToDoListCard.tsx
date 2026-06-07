import React, { useEffect, useState } from 'react'
import { taskAPI, type DashboardTask } from '../../services/workspaceApi'

const ToDoListCard: React.FC = () => {
  const [newTitle, setNewTitle] = useState('')
  const [items, setItems] = useState<DashboardTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchTasks = async () => {
      try {
        const data = await taskAPI.getAll()
        if (mounted) setItems(data)
      } catch {
        if (mounted) setItems([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchTasks()
    return () => {
      mounted = false
    }
  }, [])

  const toggle = async (id: string) => {
    const current = items.find((item) => item.id === id)
    if (!current) return

    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)))

    try {
      const updated = await taskAPI.update(id, { done: !current.done })
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
    } catch {
      setItems((prev) => prev.map((item) => (item.id === id ? current : item)))
    }
  }

  const clearDone = async () => {
    const doneItems = items.filter((item) => item.done)
    if (doneItems.length === 0) return

    setItems((prev) => prev.filter((item) => !item.done))

    try {
      await Promise.all(doneItems.map((item) => taskAPI.delete(item.id)))
    } catch {
      const refreshed = await taskAPI.getAll()
      setItems(refreshed)
    }
  }

  const addTask = async () => {
    if (!newTitle.trim()) return

    const title = newTitle.trim()
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })

    setNewTitle('')

    try {
      const task = await taskAPI.create({
        title,
        date,
        done: false,
      })
      setItems((prev) => [task, ...prev])
    } catch {
      setNewTitle(title)
    }
  }

  return (
    <article className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">To do List</div>
        <button
          type="button"
          onClick={clearDone}
          className="text-xs text-slate-500 hover:text-slate-700"
          title="Clear completed"
        >
          Clear done
        </button>
      </div>

      <div className="mt-5 flex gap-2">
        <input
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') addTask()
          }}
          placeholder="Add instructor task"
          className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-orange-400"
        />
        <button
          type="button"
          onClick={addTask}
          className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Add
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-slate-500">Loading tasks...</p>
        ) : items.map((item) => (
          <div key={item.id} className="flex items-start gap-4">
            <button
              onClick={() => toggle(item.id)}
              aria-pressed={item.done}
              className={`mt-1 flex h-5 w-5 items-center justify-center rounded-md border ${
                item.done ? 'border-orange-500 bg-orange-500' : 'border-slate-300 bg-white'
              }`}
            >
              {item.done && (
                <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>

            <div>
              <p className={`font-semibold ${item.done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                {item.title}
              </p>
              <p className="text-sm text-slate-500">{item.date}</p>
            </div>
          </div>
        ))}

        {!loading && items.length === 0 && (
          <p className="text-sm text-slate-500">No tasks yet.</p>
        )}
      </div>
    </article>
  )
}

export default ToDoListCard
