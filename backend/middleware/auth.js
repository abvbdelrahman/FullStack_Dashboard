import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    throw new AppError('Not authorized', 401)
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError('JWT_SECRET is not configured', 503)
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decoded.id)

  if (!req.user) {
    throw new AppError('User not found', 401)
  }

  next()
})

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new AppError('Not allowed to access this resource', 403)
  }

  next()
}
