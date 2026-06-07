import assert from 'node:assert/strict'
import { test } from 'node:test'
import jwt from 'jsonwebtoken'
import { generateToken } from '../utils/generateToken.js'

test('generateToken signs a JWT with the configured secret', () => {
  const previousSecret = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'test-secret'

  const token = generateToken('user-123')
  const decoded = jwt.verify(token, 'test-secret')

  assert.equal(decoded.id, 'user-123')

  if (previousSecret === undefined) delete process.env.JWT_SECRET
  else process.env.JWT_SECRET = previousSecret
})

test('generateToken fails when JWT_SECRET is missing', () => {
  const previousSecret = process.env.JWT_SECRET
  delete process.env.JWT_SECRET

  assert.throws(() => generateToken('user-123'), /JWT_SECRET is not configured/)

  if (previousSecret !== undefined) process.env.JWT_SECRET = previousSecret
})
