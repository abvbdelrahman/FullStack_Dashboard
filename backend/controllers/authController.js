import User from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { generateToken } from '../utils/generateToken.js'

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body

  const exists = await User.findOne({ email })
  if (exists) throw new AppError('Email already in use', 400)

  const user = await User.create({ name, email, password, role })
  const token = generateToken(user._id)

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401)
  }

  const token = generateToken(user._id)

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  })
})

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
    },
  })
})
