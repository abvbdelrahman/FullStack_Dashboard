import { useEffect, useState } from 'react'
import DashboardCalendarCard from '../components/dashboard/DashboardCalendarCard'
import EnrolledCourseCard from '../components/dashboard/EnrolledCourseCard'
import GreetingHeader from '../components/dashboard/GreetingHeader'
import HoursSpentCard from '../components/dashboard/HoursSpentCard'
import RecentClassesCard from '../components/dashboard/RecentClassesCard'
import ResourcesCard from '../components/dashboard/ResourcesCard'
import ToDoListCard from '../components/dashboard/ToDoListCard'
import UpcomingLessonCard from '../components/dashboard/UpcomingLessonCard'
import { useAuth } from '../context/useAuth'
import type { CalendarEvent } from '../data/calendarEvents'
import { courseAPI } from '../services/api'
import { calendarService } from '../services/calendarService'
import { dashboardAPI, type DashboardSummary } from '../services/workspaceApi'
import type { CourseListResponse } from '../types/course'

interface EnrolledCourse {
  id: string | number
  title: string
  image?: string
  progress: number
  instructor: string
  completedLessons: number
  totalLessons: number
}

const Dashboard = () => {
  const { user } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const data = await courseAPI.getAll({ limit: '3' }) as CourseListResponse
        const formattedCourses = data.items.map((course) => ({
          id: course.id,
          title: course.title,
          image: course.image,
          progress: 0,
          instructor: course.instructor?.name || 'Unknown',
          completedLessons: 0,
          totalLessons: course.totalLessons ?? 0,
        }))
        setEnrolledCourses(formattedCourses)
      } catch (err) {
        console.error('Error fetching courses:', err)
        setEnrolledCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await dashboardAPI.getSummary()
        setSummary(data)
      } catch {
        setSummary(null)
      }
    }

    fetchSummary()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await calendarService.getEvents()
        setEvents(data)
      } catch {
        setEvents([])
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm text-slate-700">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <GreetingHeader name={user?.name} />

      {summary && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Courses', summary.courses],
            ['Pending assignments', summary.pendingAssignments],
            ['Upcoming classes', summary.upcomingClasses],
            ['Open tasks', summary.openTasks],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
            </article>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <EnrolledCourseCard enrolledCourses={enrolledCourses} />
        <ResourcesCard />
        <DashboardCalendarCard events={events} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <HoursSpentCard data={summary?.hours ?? []} />
        <ToDoListCard />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <RecentClassesCard />
        <UpcomingLessonCard />
      </div>
    </div>
  )
}

export default Dashboard
