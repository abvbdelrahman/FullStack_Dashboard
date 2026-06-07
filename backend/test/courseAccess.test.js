import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  canManageCourse,
  collectCourseVideoPublicIds,
} from '../utils/courseAccess.js'

test('admin can manage any course', () => {
  assert.equal(
    canManageCourse({ _id: 'admin-1', role: 'admin' }, { owner: 'instructor-1' }),
    true
  )
})

test('instructor can only manage owned courses', () => {
  assert.equal(
    canManageCourse({ _id: 'instructor-1', role: 'instructor' }, { owner: 'instructor-1' }),
    true
  )
  assert.equal(
    canManageCourse({ _id: 'instructor-2', role: 'instructor' }, { owner: 'instructor-1' }),
    false
  )
})

test('collectCourseVideoPublicIds returns nested Cloudinary IDs', () => {
  const ids = collectCourseVideoPublicIds({
    sections: [
      { items: [{ cloudinaryPublicId: 'a' }, { cloudinaryPublicId: '' }] },
      { items: [{ cloudinaryPublicId: 'b' }] },
    ],
  })

  assert.deepEqual(ids, ['a', 'b'])
})
