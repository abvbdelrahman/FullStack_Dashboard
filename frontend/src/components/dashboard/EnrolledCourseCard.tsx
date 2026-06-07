
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

interface Course {
  id: number | string
  title: string
  completedLessons: number
  totalLessons: number
  progress: number
  image?: string
}

interface EnrolledCourseCardProps {
  enrolledCourses: Course[]
}

const EnrolledCourseCard = ({ enrolledCourses }: EnrolledCourseCardProps) => {
  const top3 = useMemo(() => {
    return [...enrolledCourses]
      .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))
      .slice(0, 3)
  }, [enrolledCourses])

  return (
    <article className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">Recent courses</span>
        <Link to="/courses" className="rounded-full bg-slate-100 px-3 py-1 text-sm">
          View all
        </Link>
      </div>

      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-3">
        {top3.map((c) => (
          <Link key={c.id} to={`/courses/${c.id}`} className="block rounded-2xl border border-slate-100 bg-white p-3 shadow-sm hover:shadow-md">
            <div className="h-28 w-full overflow-hidden rounded-md bg-slate-50">
              {c.image ? (
                <img src={c.image} alt={c.title} loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
              )}
            </div>

            <h3 className="mt-2 text-sm font-semibold">{c.title}</h3>
            <p className="text-xs text-slate-500">{c.totalLessons} lessons</p>
          </Link>
        ))}
      </div>
    </article>
  )
}

export default EnrolledCourseCard
