import express from 'express';
import { createCompany, getMyCompanies, getCompanyById, getAllCompanies } from '../controllers/companyController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, requireRole('EMPLOYER'), createCompany);
router.get('/my-companies', authenticateToken, requireRole('EMPLOYER'), getMyCompanies);
router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);

export default router;
