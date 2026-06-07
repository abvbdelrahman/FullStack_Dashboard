import type { AssignmentStatus } from '../../data/assignments'

interface AssignmentFilterProps {
  statusFilter?: AssignmentStatus | 'All'
  dateFilter?: string
  onStatusFilterChange?: (status: AssignmentStatus | 'All') => void
  onDateFilterChange?: (date: string) => void
  onSearch?: (query: string) => void
}

const statuses: (AssignmentStatus | 'All')[] = ['All', 'Done', 'Progress', 'Pending']

const AssignmentFilter = ({
  statusFilter = 'All',
  dateFilter = '',
  onStatusFilterChange,
  onDateFilterChange,
  onSearch,
}: AssignmentFilterProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Assignments</h1>
        <p className="text-sm text-slate-600">View and manage your course assignments</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search assignments"
            onChange={(e) => onSearch?.(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-orange-500 focus:outline-none"
            aria-label="Search assignments"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange?.(e.target.value as AssignmentStatus | 'All')}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-500 focus:outline-none"
          aria-label="Filter by status"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === 'All' ? 'All Status' : status}
            </option>
          ))}
        </select>

        <input
          type="month"
          value={dateFilter}
          onChange={(e) => onDateFilterChange?.(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-500 focus:outline-none"
          aria-label="Filter by date"
        />
      </div>
    </div>
  )
}

export default AssignmentFilter
