import { Router } from 'express'
import {
  createProjectEntry,
  deleteProjectEntry,
  getProjectEntryById,
  listProjectEntries,
  updateProjectEntry
} from '../controllers/projectController.js'
import { verifyJwt } from '../middleware/authMiddleware.js'

const router = Router()

router.use('/projects', verifyJwt)
router.post('/projects', createProjectEntry)
router.get('/projects', listProjectEntries)
router.get('/projects/:projectId', getProjectEntryById)
router.put('/projects/:projectId', updateProjectEntry)
router.delete('/projects/:projectId', deleteProjectEntry)

export default router
