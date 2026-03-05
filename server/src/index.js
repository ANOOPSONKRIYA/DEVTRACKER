import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import healthRoutes from './routes/healthRoutes.js'
import devSeedRoutes from './routes/devSeedRoutes.js'
import authRoutes from './routes/authRoutes.js'
import dailyLogRoutes from './routes/dailyLogRoutes.js'
import dsaRoutes from './routes/dsaRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import { connectDB } from './config/db.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

function getConfiguredOrigins() {
  return (process.env.CLIENT_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

const allowedOrigins = getConfiguredOrigins()

function isAllowedOrigin(origin) {
  if (!origin) {
    return true
  }

  if (allowedOrigins.includes(origin)) {
    return true
  }

  if (process.env.NODE_ENV !== 'production') {
    return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
  }

  return false
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true)
        return
      }

      callback(new Error(`CORS blocked for origin: ${origin}`))
    }
  })
)
app.use(express.json())

app.use('/api', healthRoutes)
app.use('/api', devSeedRoutes)
app.use('/api', authRoutes)
app.use('/api', dailyLogRoutes)
app.use('/api', dsaRoutes)
app.use('/api', projectRoutes)
app.use('/api', analyticsRoutes)

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'DevTrackr API running' })
})

async function startServer() {
  try {
    await connectDB()
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.warn('MongoDB connection warning:', error.message)
    console.warn('Starting API without database connection for local setup')
  }

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
}

startServer()
