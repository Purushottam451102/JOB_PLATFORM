import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Profile } from '../models';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name, role, phoneNumber, location, username, gender } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password, and name are required' });
        }

        const normalizedEmail = email.toLowerCase();

        if (role && !['CANDIDATE', 'EMPLOYER'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be CANDIDATE or EMPLOYER' });
        }

        const existingUser = await User.findOne({ where: { email: normalizedEmail } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email: normalizedEmail,
            password: hashedPassword,
            name,
            username,
            gender,
            role: role || 'CANDIDATE',
            phoneNumber,
            location
        });

        // Initialize empty profile
        await Profile.create({ userId: user.id });

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({ where: { email: normalizedEmail } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
};
