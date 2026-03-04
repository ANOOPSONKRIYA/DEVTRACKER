import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const DEV_FALLBACK_JWT_SECRET = 'devtrackr-local-jwt-secret'

function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET
  }

  if (process.env.NODE_ENV !== 'production') {
    return DEV_FALLBACK_JWT_SECRET
  }

  return null
}

export async function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Missing or invalid Authorization header'
    })
  }

  const secret = getJwtSecret()

  if (!secret) {
    return res.status(500).json({
      message: 'JWT_SECRET is not configured'
    })
  }

  try {
    const decoded = jwt.verify(token, secret)
    const user = await User.findById(decoded.userId).select('-password').lean()

    if (!user) {
      return res.status(401).json({
        message: 'Invalid token user'
      })
    }

    req.user = user
    return next()
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired token'
    })
  }
}
