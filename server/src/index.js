import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import healthRoutes from './routes/healthRoutes.js'
import { connectDB } from './config/db.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
  })
)
app.use(express.json())

app.use('/api', healthRoutes)

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
