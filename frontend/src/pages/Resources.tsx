import { useEffect, useMemo, useState } from 'react'
import type { FileKind, LearningFile } from '../data/workspace'
import { resourceAPI } from '../services/workspaceApi'

const fileKinds: Array<FileKind | 'All'> = ['All', 'PDF', 'Image', 'Design', 'Video', 'Link']

const Resources = () => {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<FileKind | 'All'>('All')
  const [message, setMessage] = useState<string | null>(null)
  const [resources, setResources] = useState<LearningFile[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await resourceAPI.getAll()
        setResources(data)
        setError(null)
      } catch (err) {
        setResources([])
        setError(err instanceof Error ? err.message : 'Failed to load resources')
      }
    }

    loadResources()
  }, [])

  const filteredFiles = useMemo(() => {
    const search = query.trim().toLowerCase()
    return resources.filter((file) => {
      const matchesKind = kind === 'All' || file.kind === kind
      const matchesSearch =
        !search ||
        file.title.toLowerCase().includes(search) ||
        file.course.toLowerCase().includes(search)
      return matchesKind && matchesSearch
    })
  }, [kind, query, resources])

  const addResource = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return

    const resource = await resourceAPI.create({
      title: newTitle.trim(),
      course: 'General',
      kind: 'Link',
      size: '',
      url: newUrl.trim(),
      saved: false,
    })
    setResources((currentResources) => [resource, ...currentResources])
    setNewTitle('')
    setNewUrl('')
    setMessage(`${resource.title} added.`)
  }

  const saveResource = async (file: (typeof resources)[number]) => {
    const resource = await resourceAPI.create({ ...file, saved: true })
    setMessage(`${resource.title} saved to Downloads.`)
  }

  const deleteResource = async (id: string) => {
    await resourceAPI.delete(id)
    setResources((currentResources) => currentResources.filter((resource) => resource.id !== id))
  }

  return (
    <div className="p-6">
      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Resources</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Browse course files, templates, images, and reference material.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(220px,320px)_150px]">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Search
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search resources"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Type
              <select
                value={kind}
                onChange={(event) => setKind(event.target.value as FileKind | 'All')}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              >
                {fileKinds.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="Resource title"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
          />
          <input
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
            placeholder="Resource URL"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
          />
          <button
            type="button"
            onClick={addResource}
            className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Add
          </button>
        </div>
        {message && (
          <div className="mb-5 rounded-2xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}
        {error ? (
          <div className="rounded-3xl bg-red-50 p-8 text-center text-red-700">
            {error}
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">
            No resources match your filters.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredFiles.map((file) => (
              <article key={file.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                      {file.kind}
                    </span>
                    <h2 className="mt-4 text-lg font-bold text-slate-900">{file.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{file.course}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => saveResource(file)}
                    className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-500"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteResource(file.id)}
                    className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span>{file.size}</span>
                  <span>Updated {file.updatedAt}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Resources
