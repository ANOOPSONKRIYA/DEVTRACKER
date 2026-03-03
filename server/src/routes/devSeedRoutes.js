import { Router } from 'express'
import { getSeededDataSummary, seedInsertReadCheck } from '../controllers/devSeedController.js'

const router = Router()

router.post('/dev/seed-check', seedInsertReadCheck)
router.get('/dev/seed-check/:userId', getSeededDataSummary)

export default router