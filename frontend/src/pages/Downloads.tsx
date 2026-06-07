import { useEffect, useMemo, useState } from 'react'
import type { FileKind, LearningFile } from '../data/workspace'
import { resolveApiUrl } from '../services/api'
import { resourceAPI } from '../services/workspaceApi'

const fileKinds: Array<FileKind | 'All'> = ['All', 'PDF', 'Image', 'Design', 'Video', 'Link']

const Downloads = () => {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<FileKind | 'All'>('All')
  const [files, setFiles] = useState<LearningFile[]>([])

  useEffect(() => {
    const loadFiles = async () => {
      setFiles(await resourceAPI.getAll(true))
    }

    loadFiles()
  }, [])

  const filteredFiles = useMemo(() => {
    const search = query.trim().toLowerCase()
    return files.filter((file) => {
      const matchesKind = kind === 'All' || file.kind === kind
      const matchesSearch =
        !search ||
        file.title.toLowerCase().includes(search) ||
        file.course.toLowerCase().includes(search)
      return matchesKind && matchesSearch
    })
  }, [files, kind, query])

  const removeFile = (id: string) => {
    resourceAPI.delete(id)
    setFiles((currentFiles) => currentFiles.filter((file) => file.id !== id))
  }

  return (
    <div className="p-6">
      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Downloads</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Keep track of downloaded course files and saved offline material.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(220px,320px)_150px]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search downloads"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
            />
            <select
              value={kind}
              onChange={(event) => setKind(event.target.value as FileKind | 'All')}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
            >
              {fileKinds.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
        {filteredFiles.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No downloads found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredFiles.map((file) => (
              <div key={file.id} className="grid gap-4 p-5 md:grid-cols-[1fr_110px_110px_90px_90px] md:items-center">
                <div>
                  <h2 className="font-bold text-slate-900">{file.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{file.course}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-center text-sm font-semibold text-slate-600">
                  {file.kind}
                </span>
                <span className="text-sm text-slate-500">{file.size}</span>
                <a href={resolveApiUrl(file.url)} download className="text-sm font-semibold text-orange-600">
                  Download
                </a>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="text-sm font-semibold text-red-500 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Downloads
