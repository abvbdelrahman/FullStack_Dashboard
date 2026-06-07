import Assignment from '../models/Assignment.js'
import AssignmentSubmission from '../models/AssignmentSubmission.js'
import Course from '../models/Course.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const formatAssignment = (assignment, submission = null) => ({
  id: assignment._id,
  title: assignment.title,
  course: assignment.course.title || 'Unknown Course',
  lessons: assignment.course.title || '',
  dueDate: assignment.dueDate.toISOString().split('T')[0],
  status: assignment.status,
  submitStatus: submission?.submitStatus || 'Upload',
  submissionFile: submission?.submissionFile || '',
  points: submission?.points ?? 0,
  maxPoints: assignment.maxPoints,
  feedback: submission?.feedback || '',
})

const getManagedCourseIds = async (user) => {
  if (user.role === 'admin') return null

  const courses = await Course.find({ owner: user._id }).select('_id')
  return courses.map((course) => course._id)
}

const applyManagedCourseFilter = async (user, filter = {}) => {
  const managedCourseIds = await getManagedCourseIds(user)
  if (!managedCourseIds) return filter

  if (filter.course) {
    const canAccessCourse = managedCourseIds.some((id) => id.toString() === filter.course.toString())
    return { ...filter, course: canAccessCourse ? filter.course : { $in: [] } }
  }

  return { ...filter, course: { $in: managedCourseIds } }
}

const assertCanManageAssignment = (user, assignment) => {
  if (user.role === 'admin') return

  if (assignment.course?.owner?.toString() !== user._id.toString()) {
    throw new AppError('Assignment not found', 404)
  }
}

export const createAssignment = asyncHandler(async (req, res) => {
  const { courseId, title, description, dueDate, maxPoints } = req.body

  const course = await Course.findById(courseId)
  if (!course) throw new AppError('Course not found', 404)
  if (req.user.role !== 'admin' && course.owner?.toString() !== req.user._id.toString()) {
    throw new AppError('Not allowed to manage assignments for this course', 403)
  }

  const assignment = await Assignment.create({
    course: courseId,
    title,
    description,
    dueDate,
    maxPoints,
  })

  const populated = await Assignment.findById(assignment._id).populate('course')
  res.status(201).json(formatAssignment(populated))
})

export const getAssignments = asyncHandler(async (req, res) => {
  const { courseId, status } = req.query
  const filter = {}

  if (courseId) filter.course = courseId
  if (status) filter.status = status

  const accessFilter = await applyManagedCourseFilter(req.user, filter)
  const assignments = await Assignment.find(accessFilter).populate('course').sort({ dueDate: 1 })

  res.json(assignments.map(formatAssignment))
})

export const getMyAssignments = asyncHandler(async (req, res) => {
  const { status } = req.query
  const filter = {}

  if (status) filter.status = status

  const accessFilter = await applyManagedCourseFilter(req.user, filter)
  const assignments = await Assignment.find(accessFilter).populate('course').sort({ dueDate: 1 })
  const submissions = await AssignmentSubmission.find({
    user: req.user._id,
    assignment: { $in: assignments.map((assignment) => assignment._id) },
  })
  const submissionsByAssignmentId = new Map(
    submissions.map((submission) => [submission.assignment.toString(), submission])
  )

  res.json(
    assignments.map((assignment) =>
      formatAssignment(assignment, submissionsByAssignmentId.get(assignment._id.toString()))
    )
  )
})

export const getAssignmentById = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id).populate('course')
  if (!assignment) throw new AppError('Assignment not found', 404)
  assertCanManageAssignment(req.user, assignment)

  res.json(formatAssignment(assignment))
})

export const updateAssignment = asyncHandler(async (req, res) => {
  const { title, description, dueDate, status, maxPoints } = req.body
  const existingAssignment = await Assignment.findById(req.params.id).populate('course')
  if (!existingAssignment) throw new AppError('Assignment not found', 404)
  assertCanManageAssignment(req.user, existingAssignment)

  const assignment = await Assignment.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      dueDate,
      status,
      maxPoints,
    },
    { new: true, runValidators: true }
  ).populate('course')

  if (!assignment) throw new AppError('Assignment not found', 404)

  res.json(formatAssignment(assignment))
})

export const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id).populate('course')
  if (!assignment) throw new AppError('Assignment not found', 404)
  assertCanManageAssignment(req.user, assignment)
  await Assignment.deleteOne({ _id: assignment._id })
  await AssignmentSubmission.deleteMany({ assignment: assignment._id })

  res.json({ message: 'Assignment deleted successfully' })
})

export const submitAssignment = asyncHandler(async (req, res) => {
  throw new AppError('Assignment submissions are disabled for instructor/admin-only mode', 410)

  const { submissionFile, cloudinaryPublicId } = req.body

  const assignment = await Assignment.findById(req.params.id).populate('course')
  if (!assignment) throw new AppError('Assignment not found', 404)

  const submission = await AssignmentSubmission.findOneAndUpdate(
    {
      assignment: assignment._id,
      user: req.user._id,
    },
    {
      submissionFile,
      cloudinaryPublicId,
      submitStatus: 'Submitted',
      submittedAt: new Date(),
    },
    { new: true, upsert: true, runValidators: true }
  )

  res.json(formatAssignment(assignment, submission))
})
