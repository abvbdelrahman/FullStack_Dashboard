import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calculateProgress, countLessons, getLessonKey } from '../utils/progress.js'

test('countLessons counts nested section lessons', () => {
  const total = countLessons([
    { items: [{ title: 'A' }, { title: 'B' }] },
    { items: [{ title: 'C' }] },
  ])

  assert.equal(total, 3)
})

test('calculateProgress rounds completed lesson percentage', () => {
  assert.equal(calculateProgress(['0:0'], 3), 33)
  assert.equal(calculateProgress(['0:0', '0:1', '1:0'], 3), 100)
})

test('getLessonKey creates stable lesson identifiers', () => {
  assert.equal(getLessonKey(2, 4), '2:4')
})
