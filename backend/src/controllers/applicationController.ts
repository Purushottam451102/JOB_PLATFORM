import { Request, Response } from 'express';
import { Application, Job, User, Profile } from '../models';
import { AuthRequest } from '../middleware/authMiddleware';

export const applyForJob = async (req: AuthRequest, res: Response) => {
    try {
        const { jobId, coverLetter, resumeUrl } = req.body;
        const userId = req.user?.userId;

        if (!userId) return res.sendStatus(401);

        // Check if already applied
        const existing = await Application.findOne({
            where: {
                jobId: Number(jobId),
                candidateId: userId
            }
        });

        if (existing) {
            return res.status(400).json({ message: 'Already applied to this job' });
        }

        const application = await Application.create({
            jobId: Number(jobId),
            candidateId: userId,
            coverLetter,
            resumeUrl
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Error applying for job', error });
    }
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.sendStatus(401);

        const applications = await Application.findAll({
            where: { candidateId: userId },
            include: [
                {
                    model: Job,
                    as: 'job',
                    include: [{ model: User, as: 'employer', attributes: ['name'] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error });
    }
};

export const getJobApplications = async (req: AuthRequest, res: Response) => {
    try {
        const { jobId } = req.params;
        const userId = req.user?.userId;
        if (!userId) return res.sendStatus(401);

        // Verify job belongs to employer
        const job = await Job.findByPk(Number(jobId));
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.employerId !== userId) return res.sendStatus(403);

        const applications = await Application.findAll({
            where: { jobId: Number(jobId) },
            include: [
                {
                    model: User,
                    as: 'candidate',
                    attributes: ['id', 'name', 'email'],
                    include: [{ model: Profile, as: 'profile' }]
                }
            ]
        });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error });
    }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user?.userId;

        const application = await Application.findByPk(Number(id), {
            include: [{ model: Job, as: 'job' }]
        });

        if (!application) return res.status(404).json({ message: 'Application not found' });
        // Type assertion needed because include creates dynamic properties
        const job = (application as any).job;

        if (job.employerId !== userId) return res.sendStatus(403);

        await application.update({ status });

        res.json(application);
    } catch (error) {
    }
};

export const getEmployerApplications = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.sendStatus(401);

        // Find all jobs posted by this employer
        const jobs = await Job.findAll({
            where: { employerId: userId },
            attributes: ['id']
        });

        const jobIds = jobs.map(job => job.id);

        if (jobIds.length === 0) {
            return res.json([]);
        }

        const applications = await Application.findAll({
            where: { jobId: jobIds },
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['id', 'title', 'location', 'type']
                },
                {
                    model: User,
                    as: 'candidate',
                    attributes: ['id', 'name', 'email'],
                    include: [{ model: Profile, as: 'profile' }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employer applications', error });
    }
};
