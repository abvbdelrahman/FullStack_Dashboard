import assert from 'node:assert/strict'
import test from 'node:test'
import {
  classSessionSchema,
  dashboardTaskSchema,
  discussionSchema,
  noteSchema,
  notificationSchema,
  resourceSchema,
  settingsSchema,
} from '../schemas/workspaceSchemas.js'

test('workspace schemas accept valid payloads', () => {
  assert.equal(noteSchema.parse({ title: 'Plan', body: 'Draft lesson flow' }).course, 'General')
  assert.equal(resourceSchema.parse({ title: 'Deck', url: 'https://example.com/deck' }).kind, 'Link')
  assert.equal(
    classSessionSchema.parse({
      title: 'Live review',
      instructor: 'Current instructor',
      date: '2026-06-08',
      time: '10:00 AM',
    }).status,
    'Upcoming',
  )
  assert.deepEqual(discussionSchema.parse({ title: 'Question', excerpt: 'Need feedback' }).tags, [])
  assert.equal(settingsSchema.parse({ weeklyDigest: true }).weeklyDigest, true)
  assert.equal(dashboardTaskSchema.parse({ title: 'Review assignments' }).done, false)
  assert.equal(notificationSchema.parse({ title: 'Deadline' }).time, 'Just now')
})

test('workspace schemas reject invalid payloads', () => {
  assert.throws(() => noteSchema.parse({ title: '', body: 'Body' }))
  assert.throws(() => resourceSchema.parse({ title: 'Deck' }))
  assert.throws(() => classSessionSchema.parse({ title: 'Live', instructor: 'A', date: '06-08-2026', time: '10' }))
  assert.throws(() => discussionSchema.parse({ title: 'Question', excerpt: '' }))
  assert.throws(() => settingsSchema.parse({ email: 'invalid-email' }))
  assert.throws(() => dashboardTaskSchema.parse({ title: '' }))
  assert.throws(() => notificationSchema.parse({ title: '' }))
})
