import assert from 'node:assert/strict'
import { test } from 'node:test'
import { courseSchema, lectureSchema } from '../schemas/courseSchemas.js'

test('courseSchema accepts a minimal valid course', () => {
  const result = courseSchema.safeParse({
    title: 'Intro to Design',
    price: 25,
  })

  assert.equal(result.success, true)
  assert.deepEqual(result.data.sections, [])
})

test('courseSchema rejects negative prices', () => {
  const result = courseSchema.safeParse({
    title: 'Intro to Design',
    price: -1,
  })

  assert.equal(result.success, false)
})

test('courseSchema rejects invalid instructor avatars', () => {
  const result = courseSchema.safeParse({
    title: 'Intro to Design',
    instructor: {
      name: 'Teacher',
      avatar: 'not-a-url',
    },
  })

  assert.equal(result.success, false)
})

test('lectureSchema accepts empty videoUrl for draft lessons', () => {
  const result = lectureSchema.safeParse({
    title: 'Welcome',
    videoUrl: '',
  })

  assert.equal(result.success, true)
  assert.equal(result.data.type, 'video')
})
