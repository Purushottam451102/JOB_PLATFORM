import express from 'express';
import { getJobs, getJobById, createJob, getEmployerJobs, deleteJob } from '../controllers/jobController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', authenticateToken, requireRole(['EMPLOYER']), createJob);
router.get('/employer', authenticateToken, requireRole('EMPLOYER'), getEmployerJobs);
router.delete('/:id', authenticateToken, requireRole(['EMPLOYER']), deleteJob);

export default router;
