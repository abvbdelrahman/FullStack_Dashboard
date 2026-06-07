import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  assignmentSchema,
  submitAssignmentSchema,
  updateAssignmentSchema,
} from '../schemas/assignmentSchemas.js'

test('assignmentSchema accepts a valid assignment payload', () => {
  const result = assignmentSchema.safeParse({
    courseId: 'course-123',
    title: 'Final project',
    dueDate: '2026-07-01',
  })

  assert.equal(result.success, true)
  assert.equal(result.data.description, '')
  assert.equal(result.data.maxPoints, 100)
  assert.ok(result.data.dueDate instanceof Date)
})

test('submitAssignmentSchema requires a submission file', () => {
  const result = submitAssignmentSchema.safeParse({
    submissionFile: '',
  })

  assert.equal(result.success, false)
})

test('updateAssignmentSchema rejects invalid status values', () => {
  const result = updateAssignmentSchema.safeParse({
    status: 'Submitted',
  })

  assert.equal(result.success, false)
})
