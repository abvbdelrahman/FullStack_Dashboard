import { useEffect, useState } from 'react'
import { resolveApiUrl } from '../../services/api'
import { resourceAPI } from '../../services/workspaceApi'

interface Resource {
  id: string
  title: string
  size: string
  url?: string
}

const ResourcesCard = ({ resources }: { resources?: Resource[] }) => {
  const [apiResources, setApiResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(!resources)
  const list = resources ?? apiResources

  useEffect(() => {
    if (resources) return

    let mounted = true

    const fetchResources = async () => {
      try {
        const data = await resourceAPI.getAll(true)
        if (mounted) setApiResources(data.slice(0, 4))
      } catch {
        if (mounted) setApiResources([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchResources()
    return () => {
      mounted = false
    }
  }, [resources])

  return (
    <article className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
        <span>Your Resources</span>
        <a href="/resources" className="text-orange-500 font-semibold">see more</a>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
            Loading resources...
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
            No saved resources yet.
          </div>
        ) : (
          list.map((resource) => (
            <div key={resource.id} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <div>
                <p className="font-medium text-slate-900">{resource.title}</p>
                <p className="text-sm text-slate-500">{resource.size}</p>
              </div>
              {resource.url ? (
                <a href={resolveApiUrl(resource.url)} download className="text-orange-500 text-sm font-semibold">Download</a>
              ) : (
                <a href="/resources" className="text-orange-500 text-sm font-semibold">Open</a>
              )}
            </div>
          ))
        )}
      </div>
    </article>
  )
}

export default ResourcesCard
