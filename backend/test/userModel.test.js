import assert from 'node:assert/strict'
import { test } from 'node:test'
import User from '../models/User.js'

test('User role is limited to instructor and admin', () => {
  const enumValues = User.schema.path('role').enumValues

  assert.deepEqual(enumValues, ['instructor', 'admin'])
  assert.equal(User.schema.path('role').defaultValue, 'instructor')
})
