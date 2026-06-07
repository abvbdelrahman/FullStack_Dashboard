
import { useEffect, useMemo, useState } from 'react'
import AssignmentFilter from '../components/assignments/AssignmentFilter'
import AssignmentTable from '../components/assignments/AssignmentTable'
import { assignmentAPI, courseAPI } from '../services/api'
import type { AssignmentStatus } from '../data/assignments'
import type { Course, CourseListResponse } from '../types/course'

interface Assignment {
  id: string
  title: string
  course: string
  lessons: string
  dueDate: string
  status: AssignmentStatus
  submitStatus: 'Submitted' | 'Upload'
}

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | 'All'>('All')
  const [dateFilter, setDateFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [courses, setCourses] = useState<Course[]>([])
  const [newCourseId, setNewCourseId] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().slice(0, 10))
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true)
        const data = await assignmentAPI.getAll()
        setAssignments(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch assignments')
        console.error('Error fetching assignments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseAPI.getAll({ limit: '50' }) as CourseListResponse
        setCourses(data.items)
        setNewCourseId(data.items[0]?.id || '')
      } catch {
        setCourses([])
      }
    }

    fetchCourses()
  }, [])

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const matchesStatus = statusFilter === 'All' || assignment.status === statusFilter
      const matchesDate = !dateFilter || assignment.dueDate.includes(dateFilter)
      const matchesSearch =
        !searchQuery ||
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.course.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesDate && matchesSearch
    })
  }, [assignments, statusFilter, dateFilter, searchQuery])

  const handleStatusFilterChange = (status: AssignmentStatus | 'All') => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const handleDateFilterChange = (date: string) => {
    setDateFilter(date)
    setCurrentPage(1)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleRowsPerPageChange = (nextRowsPerPage: number) => {
    setRowsPerPage(nextRowsPerPage)
    setCurrentPage(1)
  }

  const resetAssignmentForm = () => {
    setEditingAssignmentId(null)
    setNewTitle('')
    setNewDueDate(new Date().toISOString().slice(0, 10))
  }

  const saveAssignment = async () => {
    if (!newCourseId || !newTitle.trim()) return

    try {
      const payload = {
        title: newTitle.trim(),
        description: '',
        dueDate: newDueDate,
        maxPoints: 100,
      }

      if (editingAssignmentId) {
        const assignment = await assignmentAPI.update(editingAssignmentId, payload) as Assignment
        setAssignments((currentAssignments) =>
          currentAssignments.map((currentAssignment) =>
            currentAssignment.id === assignment.id ? assignment : currentAssignment,
          ),
        )
      } else {
        const assignment = await assignmentAPI.create({
          ...payload,
          courseId: newCourseId,
        }) as Assignment
        setAssignments((currentAssignments) => [assignment, ...currentAssignments])
      }

      resetAssignmentForm()
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save assignment')
    }
  }

  const editAssignment = (assignment: Assignment) => {
    const matchingCourse = courses.find((course) => course.title === assignment.course)
    setEditingAssignmentId(assignment.id)
    setNewTitle(assignment.title)
    setNewDueDate(assignment.dueDate.slice(0, 10))
    if (matchingCourse) setNewCourseId(matchingCourse.id)
  }

  const updateAssignmentStatus = async (id: string, status: AssignmentStatus) => {
    try {
      const updatedAssignment = await assignmentAPI.update(id, { status }) as Assignment
      setAssignments((currentAssignments) =>
        currentAssignments.map((assignment) => (assignment.id === id ? updatedAssignment : assignment)),
      )
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update assignment')
    }
  }

  const deleteAssignment = async (id: string) => {
    try {
      await assignmentAPI.delete(id)
      setAssignments((currentAssignments) => currentAssignments.filter((assignment) => assignment.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete assignment')
    }
  }

  return (
    <div className="p-6">
      <section className="mb-6 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Manage assignments</h1>
        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr_180px_auto]">
          <select
            value={newCourseId}
            onChange={(event) => setNewCourseId(event.target.value)}
            disabled={Boolean(editingAssignmentId)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
          >
            {courses.length === 0 ? (
              <option value="">No courses available</option>
            ) : (
              courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))
            )}
          </select>
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="Assignment title"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(event) => setNewDueDate(event.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
          />
          <button
            type="button"
            onClick={saveAssignment}
            className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            {editingAssignmentId ? 'Save assignment' : 'Add assignment'}
          </button>
        </div>
        {editingAssignmentId && (
          <button
            type="button"
            onClick={resetAssignmentForm}
            className="mt-3 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel edit
          </button>
        )}
      </section>

      <AssignmentFilter
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onDateFilterChange={handleDateFilterChange}
        onSearch={handleSearch}
      />

      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Loading assignments...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <AssignmentTable
          assignments={filteredAssignments}
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onStatusChange={updateAssignmentStatus}
          onEdit={editAssignment}
          onDelete={deleteAssignment}
        />
      )}
    </div>
  )
}

export default Assignments

