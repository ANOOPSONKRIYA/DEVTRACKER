import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const SALT_ROUNDS = 10
const DEFAULT_TOKEN_EXPIRY = '7d'
const DEV_FALLBACK_JWT_SECRET = 'devtrackr-local-jwt-secret'

function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET
  }

  if (process.env.NODE_ENV !== 'production') {
    return DEV_FALLBACK_JWT_SECRET
  }

  throw new Error('JWT_SECRET is not configured')
}

function issueToken(userId) {
  const secret = getJwtSecret()

  return jwt.sign(
    { userId },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_TOKEN_EXPIRY }
  )
}

function buildUserPayload(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  }
}

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existingUser = await User.findOne({ email: normalizedEmail }).lean()

    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists with this email'
      })
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword
    })

    const token = issueToken(user._id.toString())

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: buildUserPayload(user)
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Invalid user data',
        error: error.message
      })
    }

    return res.status(500).json({
      message: 'Failed to register user',
      error: error.message
    })
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const token = issueToken(user._id.toString())

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: buildUserPayload(user)
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to login user',
      error: error.message
    })
  }
}

export function getProtectedExample(req, res) {
  return res.status(200).json({
    message: 'Protected route access granted',
    user: req.user
  })
}
