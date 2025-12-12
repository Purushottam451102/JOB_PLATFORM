import express from 'express';
import { getStats, getAllUsers, deleteUser } from '../controllers/adminController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole('ADMIN'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

export default router;
