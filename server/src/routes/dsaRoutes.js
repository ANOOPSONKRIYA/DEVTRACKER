import { Router } from 'express'
import {
  createDSAEntry,
  deleteDSAEntry,
  getDSAEntryById,
  listDSAEntries,
  updateDSAEntry
} from '../controllers/dsaController.js'
import { verifyJwt } from '../middleware/authMiddleware.js'

const router = Router()

router.use('/dsa-entries', verifyJwt)
router.post('/dsa-entries', createDSAEntry)
router.get('/dsa-entries', listDSAEntries)
router.get('/dsa-entries/:entryId', getDSAEntryById)
router.put('/dsa-entries/:entryId', updateDSAEntry)
router.delete('/dsa-entries/:entryId', deleteDSAEntry)

export default router
