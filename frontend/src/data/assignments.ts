export type AssignmentStatus = 'Done' | 'Progress' | 'Pending'

export interface Assignment {
  id: string
  title: string
  course: string
  lessons: string
  dueDate: string
  status: AssignmentStatus
  submitStatus: 'Submitted' | 'Upload'
}
