import { Request, Response } from 'express';
import { Job, User, Application, Company } from '../models';
import { AuthRequest } from '../middleware/authMiddleware';
import sequelize from 'sequelize';

export const getJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.findAll({
            include: [
                {
                    model: User,
                    as: 'employer',
                    attributes: ['name', 'email']
                },
                {
                    model: Company,
                    as: 'company',
                    attributes: ['id', 'name', 'logo', 'location']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
};

export const getJobById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const job = await Job.findByPk(Number(id), {
            include: [
                {
                    model: User,
                    as: 'employer',
                    attributes: ['name', 'email']
                },
                {
                    model: Company,
                    as: 'company',
                    attributes: ['id', 'name', 'logo', 'location']
                }
            ]
        });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching job', error });
    }
};

export const createJob = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, requirements, salary, location, type, companyId } = req.body;
        const userId = req.user?.userId;

        if (!userId) return res.sendStatus(401);

        // Verify company ownership
        const company = await Company.findOne({ where: { id: companyId, employerId: userId } });
        if (!company) {
            return res.status(403).json({ message: 'You can only post jobs for your own companies' });
        }

        const job = await Job.create({
            title,
            description,
            requirements,
            salary,
            location,
            type,
            employerId: userId,
            companyId: companyId
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Error creating job', error });
    }
};

export const getEmployerJobs = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.sendStatus(401);

        const jobs = await Job.findAll({
            where: { employerId: userId },
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM "Applications" AS "applications"
                            WHERE
                                "applications"."jobId" = "Job"."id"
                        )`),
                        'applicationCount'
                    ]
                ]
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employer jobs', error });
    }
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) return res.sendStatus(401);

        const job = await Job.findByPk(id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.employerId !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await job.destroy();
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting job', error });
    }
};
