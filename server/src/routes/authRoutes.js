import { Router } from 'express'
import { getProtectedExample, loginUser, registerUser } from '../controllers/authController.js'
import { verifyJwt } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/auth/register', registerUser)
router.post('/auth/login', loginUser)
router.get('/auth/protected', verifyJwt, getProtectedExample)

export default router
