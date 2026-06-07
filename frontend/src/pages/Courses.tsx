import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { courseAPI } from '../services/api'
import type { Course, CourseListResponse } from '../types/course'

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [priceFilter, setPriceFilter] = useState<'All' | 'Free' | 'Paid'>('All')
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    duration: '',
    modules: '',
    price: '0',
    tags: '',
    audience: '',
  })

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true)
        const data = (await courseAPI.getAll({ limit: '50' })) as CourseListResponse
        setCourses(data.items || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses')
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  const resetForm = () => {
    setEditingCourseId(null)
    setForm({
      title: '',
      description: '',
      image: '',
      duration: '',
      modules: '',
      price: '0',
      tags: '',
      audience: '',
    })
  }

  const buildPayload = () => ({
    title: form.title.trim(),
    description: form.description.trim(),
    image: form.image.trim(),
    duration: form.duration.trim(),
    modules: form.modules.trim(),
    price: Number(form.price) || 0,
    tags: form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    audience: form.audience.trim(),
  })

  const saveCourse = async () => {
    const payload = buildPayload()
    if (!payload.title) {
      setError('Course title is required')
      return
    }

    try {
      if (editingCourseId) {
        const updatedCourse = (await courseAPI.update(editingCourseId, payload)) as Course
        setCourses((currentCourses) =>
          currentCourses.map((course) => (course.id === updatedCourse.id ? updatedCourse : course)),
        )
        setMessage(`${updatedCourse.title} updated.`)
      } else {
        const createdCourse = (await courseAPI.create(payload)) as Course
        setCourses((currentCourses) => [createdCourse, ...currentCourses])
        setMessage(`${createdCourse.title} created.`)
      }

      resetForm()
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course')
    }
  }

  const editCourse = (course: Course) => {
    setEditingCourseId(course.id)
    setForm({
      title: course.title || '',
      description: course.description || '',
      image: course.image || '',
      duration: course.duration || '',
      modules: course.modules || '',
      price: String(course.price || 0),
      tags: (course.tags || []).join(', '),
      audience: course.audience || '',
    })
    setMessage(null)
  }

  const deleteCourse = async (course: Course) => {
    try {
      await courseAPI.delete(course.id)
      setCourses((currentCourses) => currentCourses.filter((currentCourse) => currentCourse.id !== course.id))
      if (editingCourseId === course.id) resetForm()
      setMessage(`${course.title} deleted.`)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course')
    }
  }

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.tags?.some((tag) => tag.toLowerCase().includes(query))
      const matchesPrice =
        priceFilter === 'All' ||
        (priceFilter === 'Free' && (course.price || 0) === 0) ||
        (priceFilter === 'Paid' && (course.price || 0) > 0)

      return matchesSearch && matchesPrice
    })
  }, [courses, priceFilter, searchQuery])

  return (
    <div className="p-6">
      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Courses</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Manage course content, lessons, pricing, and instructor workspace access.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(220px,320px)_140px]">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Search
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search courses"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Price
              <select
                value={priceFilter}
                onChange={(event) => setPriceFilter(event.target.value as 'All' | 'Free' | 'Paid')}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400"
              >
                <option value="All">All</option>
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">
            {editingCourseId ? 'Edit course' : 'Create course'}
          </h2>
          {editingCourseId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <input
            value={form.title}
            onChange={(event) => updateForm('title', event.target.value)}
            placeholder="Course title"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
          />
          <input
            value={form.image}
            onChange={(event) => updateForm('image', event.target.value)}
            placeholder="Image URL"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
          />
          <input
            value={form.duration}
            onChange={(event) => updateForm('duration', event.target.value)}
            placeholder="Duration, e.g. 6 weeks"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
          />
          <input
            value={form.modules}
            onChange={(event) => updateForm('modules', event.target.value)}
            placeholder="Modules, e.g. 8 modules"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
          />
          <input
            type="number"
            min="0"
            value={form.price}
            onChange={(event) => updateForm('price', event.target.value)}
            placeholder="Price"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
          />
          <input
            value={form.tags}
            onChange={(event) => updateForm('tags', event.target.value)}
            placeholder="Tags separated by commas"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
          />
          <input
            value={form.audience}
            onChange={(event) => updateForm('audience', event.target.value)}
            placeholder="Target audience"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 lg:col-span-2"
          />
          <textarea
            value={form.description}
            onChange={(event) => updateForm('description', event.target.value)}
            placeholder="Course description"
            rows={4}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 lg:col-span-2"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={saveCourse}
            className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            {editingCourseId ? 'Save course' : 'Create course'}
          </button>
          {message && <p className="text-sm font-medium text-emerald-600">{message}</p>}
        </div>
      </section>

      {loading ? (
        <div className="mt-6 rounded-4xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
          Loading courses...
        </div>
      ) : error ? (
        <div className="mt-6 rounded-4xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="mt-6 rounded-4xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
          No courses match your filters.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <article
              key={course.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-video bg-slate-100">
                {course.image ? (
                  <img src={course.image} alt={course.title} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
                )}
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  {(course.tags || []).slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900">{course.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{course.description}</p>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <span className="block text-xs text-slate-400">Instructor</span>
                    <span className="font-semibold text-slate-800">{course.instructor?.name || 'Unknown'}</span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <span className="block text-xs text-slate-400">Lessons</span>
                    <span className="font-semibold text-slate-800">{course.totalLessons || 0}</span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <span className="block text-xs text-slate-400">Rating</span>
                    <span className="font-semibold text-slate-800">{course.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <span className="block text-xs text-slate-400">Price</span>
                    <span className="font-semibold text-slate-800">
                      {(course.price || 0) === 0 ? 'Free' : `$${course.price}`}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <Link
                    to={`/courses/${course.id}`}
                    className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-500"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => editCourse(course)}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCourse(course)}
                    className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default Courses
