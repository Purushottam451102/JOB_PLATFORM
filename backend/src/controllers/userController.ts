import { Request, Response } from 'express';
import { User, Profile } from '../models';
import { AuthRequest } from '../middleware/authMiddleware';

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.sendStatus(401);

        const user = await User.findByPk(userId, {
            include: [{ model: Profile, as: 'profile' }]
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Calculate stats dynamically if needed, or use stored stats
        // For now, let's just ensure profile exists
        if (!user.profile) {
            // Create profile if it doesn't exist (though it should be created on register)
            await Profile.create({ userId: user.id, bio: '', resumeUrl: '', skills: [], companyName: '', companyUrl: '' });
            await user.reload({ include: [{ model: Profile, as: 'profile' }] });
        }

        // Exclude password
        const { password, ...userWithoutPassword } = user.toJSON();
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.sendStatus(401);

        const {
            headline,
            bio,
            location,
            phoneNumber,
            skills,
            profilePicture,
            githubUrl,
            linkedinUrl,
            gender,
            workExperience,
            jobPreferences
        } = req.body;

        const user = await User.findByPk(userId, { include: [{ model: Profile, as: 'profile' }] });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update User fields
        await user.update({
            headline,
            location,
            phoneNumber,
            profilePicture,
            githubUrl,
            linkedinUrl,
            gender
        });

        // Update Profile fields
        // Note: bio and skills are currently on Profile in some places and User in others.
        // Based on previous code, User model has them. But Profile model also has them.
        // Let's update both for consistency or migrate to one. 
        // For now, updating Profile model as that's where the new fields are.

        let profile = user.profile;
        if (!profile) {
            profile = await Profile.create({ userId: user.id, bio: '', resumeUrl: '', skills: [], companyName: '', companyUrl: '' });
        }

        await profile.update({
            bio,
            skills: typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills, // Handle string or array
            workExperience,
            jobPreferences
        });

        // Reload to get fresh data
        await user.reload({ include: [{ model: Profile, as: 'profile' }] });

        // Exclude password
        const { password, ...userWithoutPassword } = user.toJSON();
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Error updating profile', error });
    }
};
