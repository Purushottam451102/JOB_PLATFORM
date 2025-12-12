import express from 'express';
import upload from '../middleware/uploadMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

export default router;
