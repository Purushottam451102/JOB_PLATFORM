import express from 'express';
import { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus, getEmployerApplications } from '../controllers/applicationController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, requireRole('CANDIDATE'), applyForJob);
router.get('/my', authenticateToken, requireRole('CANDIDATE'), getMyApplications);
router.get('/employer', authenticateToken, requireRole('EMPLOYER'), getEmployerApplications);
router.get('/job/:jobId', authenticateToken, requireRole('EMPLOYER'), getJobApplications);
router.put('/:id/status', authenticateToken, requireRole('EMPLOYER'), updateApplicationStatus);

export default router;
