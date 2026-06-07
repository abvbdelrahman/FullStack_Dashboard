export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate field value' })
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') })
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }

  res.status(statusCode).json({ message })
}
