import { Request, Response } from 'express';
import { User, Job, Application } from '../models';
import { AuthRequest } from '../middleware/authMiddleware';

export const getStats = async (req: AuthRequest, res: Response) => {
    try {
        const [userCount, jobCount, applicationCount] = await Promise.all([
            User.count(),
            Job.count(),
            Application.count()
        ]);

        res.json({
            users: userCount,
            jobs: jobCount,
            applications: applicationCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id: Number(id) } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
