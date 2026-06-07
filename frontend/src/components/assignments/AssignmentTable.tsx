import { useMemo } from 'react'
import type { Assignment, AssignmentStatus } from '../../data/assignments'

interface AssignmentTableProps {
  assignments: Assignment[]
  statusFilter?: AssignmentStatus | 'All'
  dateFilter?: string
  rowsPerPage?: number
  onRowsPerPageChange?: (rowsPerPage: number) => void
  currentPage?: number
  onPageChange?: (page: number) => void
  onStatusChange?: (id: string, status: AssignmentStatus) => void
  onEdit?: (assignment: Assignment) => void
  onDelete?: (id: string) => void
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const statusColors = {
  Done: 'bg-emerald-50 text-emerald-600',
  Progress: 'bg-blue-50 text-blue-600',
  Pending: 'bg-red-50 text-red-600',
}

const statusDots = {
  Done: 'bg-emerald-500',
  Progress: 'bg-blue-500',
  Pending: 'bg-red-500',
}

const AssignmentTable = ({
  assignments,
  statusFilter = 'All',
  dateFilter = '',
  rowsPerPage = 10,
  onRowsPerPageChange,
  currentPage = 1,
  onPageChange,
  onStatusChange,
  onEdit,
  onDelete,
}: AssignmentTableProps) => {
  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const matchesStatus = statusFilter === 'All' || assignment.status === statusFilter
      const matchesDate = !dateFilter || assignment.dueDate.includes(dateFilter)
      return matchesStatus && matchesDate
    })
  }, [assignments, statusFilter, dateFilter])

  const paginatedAssignments = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredAssignments.slice(start, end)
  }, [filteredAssignments, currentPage, rowsPerPage])

  const totalPages = Math.ceil(filteredAssignments.length / rowsPerPage)
  const safeTotalPages = Math.max(totalPages, 1)

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-4 text-left font-semibold text-slate-900">Assignment Title</th>
            <th className="px-6 py-4 text-left font-semibold text-slate-900">Course/lessons</th>
            <th className="px-6 py-4 text-left font-semibold text-slate-900">Due Date</th>
            <th className="px-6 py-4 text-left font-semibold text-slate-900">Status</th>
            <th className="px-6 py-4 text-left font-semibold text-slate-900">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAssignments.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                No assignments found.
              </td>
            </tr>
          ) : (
            paginatedAssignments.map((assignment) => (
              <tr key={assignment.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-900">{assignment.title}</td>
                <td className="px-6 py-4 text-slate-600">{assignment.course}</td>
                <td className="px-6 py-4 text-slate-600">{formatDate(assignment.dueDate)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${statusDots[assignment.status]}`} />
                    <select
                      value={assignment.status}
                      onChange={(event) => onStatusChange?.(assignment.id, event.target.value as AssignmentStatus)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold outline-none ${statusColors[assignment.status]}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Progress">Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(assignment)}
                      className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onStatusChange?.(assignment.id, 'Done')}
                      className="rounded-full bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-500 transition hover:bg-orange-100"
                    >
                      Mark done
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete?.(assignment.id)}
                      className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
        <select
          value={rowsPerPage}
          onChange={(event) => onRowsPerPageChange?.(Number(event.target.value))}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700"
          aria-label="Rows per page"
        >
          <option value={10}>Show 10</option>
          <option value={25}>Show 25</option>
          <option value={50}>Show 50</option>
        </select>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange?.(Math.max(currentPage - 1, 1))}
            className="rounded-lg border border-slate-200 px-2 py-1 text-slate-600 disabled:opacity-50"
            aria-label="Previous page"
          >
            Prev
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, safeTotalPages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange?.(page)}
                className={`h-8 w-8 rounded-lg text-sm font-semibold ${
                  currentPage === page ? 'bg-orange-500 text-white' : 'border border-slate-200 text-slate-600'
                }`}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={currentPage === safeTotalPages}
            onClick={() => onPageChange?.(Math.min(currentPage + 1, safeTotalPages))}
            className="rounded-lg border border-slate-200 px-2 py-1 text-slate-600 disabled:opacity-50"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssignmentTable
