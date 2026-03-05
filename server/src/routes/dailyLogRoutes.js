import { Router } from 'express'
import {
  createDailyLog,
  deleteDailyLog,
  getDailyLogById,
  listDailyLogs,
  updateDailyLog
} from '../controllers/dailyLogController.js'
import { verifyJwt } from '../middleware/authMiddleware.js'

const router = Router()

router.use('/daily-logs', verifyJwt)
router.post('/daily-logs', createDailyLog)
router.get('/daily-logs', listDailyLogs)
router.get('/daily-logs/:logId', getDailyLogById)
router.put('/daily-logs/:logId', updateDailyLog)
router.delete('/daily-logs/:logId', deleteDailyLog)

export default router
