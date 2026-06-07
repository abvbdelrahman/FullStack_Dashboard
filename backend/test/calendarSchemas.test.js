import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calendarEventSchema } from '../schemas/calendarSchemas.js'

test('calendarEventSchema accepts a valid event payload', () => {
  const result = calendarEventSchema.safeParse({
    title: 'Live session',
    date: '2026-06-15',
  })

  assert.equal(result.success, true)
  assert.equal(result.data.category, '')
  assert.equal(result.data.notes, '')
})

test('calendarEventSchema rejects invalid date formats', () => {
  const result = calendarEventSchema.safeParse({
    title: 'Live session',
    date: '06/15/2026',
  })

  assert.equal(result.success, false)
})
