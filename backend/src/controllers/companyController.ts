import { Request, Response } from 'express';
import { Company, User } from '../models';
import { AuthRequest } from '../middleware/authMiddleware';

export const createCompany = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { name, description, website, location, logo } = req.body;

        if (!userId) return res.sendStatus(401);

        const company = await Company.create({
            name,
            description,
            website,
            location,
            logo,
            employerId: userId
        });

        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ message: 'Error creating company', error });
    }
};

export const getMyCompanies = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.sendStatus(401);

        const companies = await Company.findAll({
            where: { employerId: userId }
        });

        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching companies', error });
    }
};

export const getCompanyById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const company = await Company.findByPk(Number(id), {
            include: [{ model: User, as: 'employer', attributes: ['name', 'email'] }]
        });
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company', error });
    }
};

export const getAllCompanies = async (req: Request, res: Response) => {
    try {
        const companies = await Company.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'name', 'logo', 'location', 'website', 'description']
        });
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching companies', error });
    }
};
