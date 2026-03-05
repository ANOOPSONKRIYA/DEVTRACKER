import { Router } from 'express'
import {
  getDSADifficultyDistribution,
  getSummaryMetrics,
  getWeeklyHoursTrend
} from '../controllers/analyticsController.js'
import { verifyJwt } from '../middleware/authMiddleware.js'

const router = Router()

router.use('/analytics', verifyJwt)
router.get('/analytics/summary', getSummaryMetrics)
router.get('/analytics/weekly-hours', getWeeklyHoursTrend)
router.get('/analytics/dsa-distribution', getDSADifficultyDistribution)

export default router
