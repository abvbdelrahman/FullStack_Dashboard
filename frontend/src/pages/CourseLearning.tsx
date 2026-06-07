import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { courseAPI } from '../services/api'
import type { Course, CourseLecture, LearningCourseResponse } from '../types/course'

const CourseLearning = () => {
  const { id } = useParams()
  const [data, setData] = useState<LearningCourseResponse | null>(null)
  const [activeLessonKey, setActiveLessonKey] = useState('0:0')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)

  const getFirstLessonKey = (response: LearningCourseResponse) => {
    for (let sectionIndex = 0; sectionIndex < (response.course.sections || []).length; sectionIndex += 1) {
      const section = response.course.sections?.[sectionIndex]
      if (section?.items?.length) {
        return `${sectionIndex}:0`
      }
    }

    return null
  }

  useEffect(() => {
    const loadLearningCourse = async () => {
      if (!id) return

      try {
        setLoading(true)
        const response = (await courseAPI.getLearningCourse(id)) as LearningCourseResponse
        const firstLessonKey = getFirstLessonKey(response)
        setData(response)
        if (firstLessonKey) setActiveLessonKey(firstLessonKey)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load learning view')
      } finally {
        setLoading(false)
      }
    }

    loadLearningCourse()
  }, [id])

  const activeLesson = useMemo(() => {
    const [sectionIndex, lectureIndex] = activeLessonKey.split(':').map(Number)
    return data?.course.sections?.[sectionIndex]?.items?.[lectureIndex] || null
  }, [activeLessonKey, data])

  const hasLessons = (data?.course.sections || []).some((section) => Boolean(section.items?.length))

  const getUploadTarget = async (file: File) => {
    if (!id || !data) return null

    const currentLesson = data.course.sections?.[Number(activeLessonKey.split(':')[0])]?.items?.[
      Number(activeLessonKey.split(':')[1])
    ]

    if (currentLesson) {
      const [sectionIndex, lectureIndex] = activeLessonKey.split(':').map(Number)
      return { sectionIndex, lectureIndex }
    }

    let course = data.course
    let sectionIndex = course.sections?.findIndex((section) => section.items !== undefined) ?? -1

    if (sectionIndex < 0) {
      const sectionResponse = (await courseAPI.createSection(id, 'Uploaded lessons')) as Course
      course = sectionResponse
      sectionIndex = Math.max((course.sections?.length || 1) - 1, 0)
    }

    const lessonTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'Uploaded lesson'
    const section = course.sections?.[sectionIndex]
    const lectureIndex = section?.items?.length || 0

    await courseAPI.createLecture(id, sectionIndex, {
      title: lessonTitle.length >= 2 ? lessonTitle : 'Uploaded lesson',
      label: lessonTitle.length >= 2 ? lessonTitle : 'Uploaded lesson',
      description: 'Uploaded from device.',
      type: 'video',
    })

    setActiveLessonKey(`${sectionIndex}:${lectureIndex}`)
    return { sectionIndex, lectureIndex }
  }

  const uploadLesson = async (file: File) => {
    if (!id) return

    try {
      setUploading(true)
      setUploadMessage(null)
      setUploadError(null)
      const target = await getUploadTarget(file)
      if (!target) {
        throw new Error('Course is not ready for upload')
      }
      await courseAPI.uploadLessonVideo(id, target.sectionIndex, target.lectureIndex, file)
      const response = (await courseAPI.getLearningCourse(id)) as LearningCourseResponse
      setData(response)
      setUploadMessage('Lesson video uploaded.')
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload lesson video')
    } finally {
      setUploading(false)
    }
  }

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadLesson(file)
    }
    event.target.value = ''
  }

  if (loading) {
    return <div className="p-6"><div className="rounded-4xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">Loading lessons...</div></div>
  }

  if (error || !data) {
    return <div className="p-6"><div className="rounded-4xl border border-red-200 bg-red-50 p-6 text-red-700">{error || 'Course not found'}</div></div>
  }

  const { course } = data

  return (
    <div className="p-6">
      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <Link to={`/courses/${course.id}`} className="text-sm font-semibold text-orange-600">Back to course</Link>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">{course.title}</h1>
            <p className="mt-2 text-slate-500">Instructor workspace</p>
          </div>
          <Link to={`/courses/${course.id}`} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500">
            Course details
          </Link>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="aspect-video overflow-hidden rounded-3xl bg-slate-950">
            {activeLesson?.videoUrl ? (
              <video
                controls
                src={activeLesson.videoUrl}
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center text-slate-300">
                <p>
                  {activeLesson?.description ||
                    (hasLessons ? 'Select a lesson to manage its content.' : 'Add a lesson to this course before uploading video.')}
                </p>
                <label
                  htmlFor="lesson-video-upload"
                  className={`rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${
                    uploading
                      ? 'cursor-default bg-slate-700 text-slate-400'
                      : 'cursor-pointer bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {uploading ? 'Uploading...' : activeLesson ? 'Upload lesson video' : 'Upload lesson from device'}
                </label>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-bold text-slate-900">{activeLesson?.title || activeLesson?.label || 'No lesson selected'}</h2>
            <p className="mt-2 text-slate-500">{activeLesson?.description || 'No lesson description available.'}</p>
            <input
              id="lesson-video-upload"
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              disabled={uploading}
              className="sr-only"
            />
            {activeLesson?.videoUrl && (
              <label
                htmlFor="lesson-video-upload"
                className={`mt-5 inline-flex rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                  uploading || !activeLesson
                    ? 'cursor-default bg-slate-200 text-slate-500'
                    : 'cursor-pointer bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {uploading ? 'Uploading...' : 'Replace lesson video'}
              </label>
            )}
            {uploadError && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{uploadError}</p>}
            {uploadMessage && <p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">{uploadMessage}</p>}
          </div>
        </section>

        <aside className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Lessons</h2>
          <div className="mt-5 space-y-4">
            {(course.sections || []).map((section, sectionIndex) => (
              <div key={`${section.title}-${sectionIndex}`}>
                <h3 className="text-sm font-semibold text-slate-500">{section.title || `Section ${sectionIndex + 1}`}</h3>
                <div className="mt-2 space-y-2">
                  {(section.items || []).map((lesson: CourseLecture, lectureIndex) => {
                    const lessonKey = `${sectionIndex}:${lectureIndex}`
                    const isActive = activeLessonKey === lessonKey
                    return (
                      <button
                        key={lessonKey}
                        type="button"
                        onClick={() => setActiveLessonKey(lessonKey)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                          isActive ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block font-semibold">{lesson.title || lesson.label || `Lesson ${lectureIndex + 1}`}</span>
                        <span className="mt-1 block text-xs text-slate-400">
                          {lesson.duration || lesson.type || 'Lesson'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CourseLearning
