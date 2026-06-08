import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { connectDB } from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import enrollmentRoutes from './routes/enrollmentRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import calendarRoutes from './routes/calendarRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import assignmentRoutes from './routes/assignmentRoutes.js'
import workspaceRoutes from './routes/workspaceRoutes.js'
import { handleStripeWebhook } from './controllers/stripeWebhookController.js'
import { getDemoDownload } from './utils/demoDownloads.js'

const app = express()
const PORT = process.env.PORT || 5000
const isVercel = Boolean(process.env.VERCEL)
const localClientUrls = ['http://localhost:5173', 'http://127.0.0.1:5173']
const configuredClientUrls = [
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS || '').split(','),
]
  .map((url) => url?.trim())
  .filter(Boolean)
const allowedOrigins = new Set([
  ...(process.env.NODE_ENV === 'production' ? [] : localClientUrls),
  ...configuredClientUrls,
])

app.use(helmet())
app.use(
  cors({
    origin: true,
    credentials: true,
  })
)

app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
)
app.use(express.json())

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 })
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/demo-downloads/:fileName', (req, res) => {
  const demoDownload = getDemoDownload(req.params.fileName)
  if (!demoDownload) {
    return res.status(404).json({ message: 'Demo file not found' })
  }

  res.attachment(req.params.fileName)
  res.type(demoDownload.type)
  res.send(Buffer.from(demoDownload.body))
})

app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    next(err)
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/calendar', calendarRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/assignments', assignmentRoutes)
app.use('/api/workspace', workspaceRoutes)

app.use(errorHandler)

export default app

const start = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`)
  })
}

if (!isVercel) {
  start().catch((err) => {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  })
}
