import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { courseAPI } from '../services/api'
import type { Course } from '../types/course'

const formatPrice = (price?: number) => ((price || 0) === 0 ? 'Free' : `$${price}`)

const CourseDetails = () => {
  const { id } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return

      try {
        setLoading(true)
        const courseData = await courseAPI.getById(id) as Course
        setCourse(courseData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course')
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [id])

  if (loading) {
    return <div className="p-6"><div className="rounded-4xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">Loading course...</div></div>
  }

  if (error || !course) {
    return <div className="p-6"><div className="rounded-4xl border border-red-200 bg-red-50 p-6 text-red-700">{error || 'Course not found'}</div></div>
  }

  return (
    <div className="p-6">
      <section className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="p-8">
            <Link to="/courses" className="text-sm font-semibold text-orange-600">Back to courses</Link>
            <div className="mt-5 flex flex-wrap gap-2">
              {(course.tags || []).slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mt-5 text-4xl font-bold text-slate-950">{course.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{course.description}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="text-xs text-slate-400">Price</span>
                <p className="mt-1 font-bold text-slate-900">{formatPrice(course.price)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="text-xs text-slate-400">Lessons</span>
                <p className="mt-1 font-bold text-slate-900">{course.totalLessons || 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="text-xs text-slate-400">Rating</span>
                <p className="mt-1 font-bold text-slate-900">{course.rating?.toFixed(1) || '0.0'}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="text-xs text-slate-400">Reviews</span>
                <p className="mt-1 font-bold text-slate-900">{course.reviews || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-100">
            {course.image ? (
              <img src={course.image} alt={course.title} className="h-full min-h-80 w-full object-cover" />
            ) : (
              <div className="flex h-full min-h-80 items-center justify-center text-slate-400">No image</div>
            )}
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">What you will learn</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {(course.whatYouLearn || []).length === 0 ? (
                <p className="text-sm text-slate-500">No learning outcomes listed.</p>
              ) : (
                course.whatYouLearn?.map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{item}</div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Course content</h2>
            <div className="mt-5 space-y-3">
              {(course.sections || []).length === 0 ? (
                <p className="text-sm text-slate-500">No sections available.</p>
              ) : (
                course.sections?.map((section, sectionIndex) => (
                  <div key={`${section.title}-${sectionIndex}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-slate-900">{section.title || `Section ${sectionIndex + 1}`}</h3>
                      <span className="text-sm text-slate-500">{section.items?.length || 0} lessons</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {(section.items || []).map((lesson, lessonIndex) => (
                        <div key={`${lesson.title}-${lessonIndex}`} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm">
                          <span className="font-medium text-slate-700">{lesson.title || lesson.label || `Lesson ${lessonIndex + 1}`}</span>
                          <span className="text-slate-400">{lesson.isPreview ? 'Preview' : lesson.duration || lesson.type || 'Lesson'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <aside className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            {course.instructor?.avatar && <img src={course.instructor.avatar} alt="" className="h-14 w-14 rounded-2xl object-cover" />}
            <div>
              <p className="font-bold text-slate-900">{course.instructor?.name || 'Unknown instructor'}</p>
              <p className="text-sm text-slate-500">{course.instructor?.role || 'Instructor'}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-600">
            {(course.materialIncludes || []).map((item) => <p key={item} className="rounded-2xl bg-slate-50 p-3">{item}</p>)}
          </div>

          <Link to={`/courses/${course.id}/learn`} className="mt-6 block rounded-2xl bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600">
            Open course workspace
          </Link>
        </aside>
      </div>
    </div>
  )
}

export default CourseDetails
