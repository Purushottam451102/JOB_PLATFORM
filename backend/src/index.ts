import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import applicationRoutes from './routes/applicationRoutes';
import uploadRoutes from './routes/uploadRoutes';
import userRoutes from './routes/userRoutes';
import companyRoutes from './routes/companyRoutes';
import path from 'path';
import initializeModels from './scripts/modelInitializer';

dotenv.config();

// Initialize DB and start server
const startServer = async () => {
    try {
        await initializeModels();

        const app = express();
        const PORT = process.env.PORT || 5000;

        app.use(cors());
        app.use(express.json());

        app.get('/', (req, res) => {
            res.send('Job Board API is running');
        });

        // App Routes
        app.use('/api/auth', authRoutes);
        app.use('/api/jobs', jobRoutes);
        app.use('/api/applications', applicationRoutes);
        app.use('/api/upload', uploadRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/companies', companyRoutes);

        app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
