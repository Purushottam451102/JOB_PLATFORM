import sequelize from '../config/database';
import { User, Profile, Job, Application } from '../models';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true }); // Reset DB

        const hashedPassword = await bcrypt.hash('password123', 10);

        // 1. Admin
        await User.create({
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
            headline: 'System Administrator',
            bio: 'I manage the job board.',
            location: 'New York, NY',
        });

        // 2. Employer
        const employer = await User.create({
            email: 'employer@techcorp.com',
            password: hashedPassword,
            name: 'John Doe (Tech Corp)',
            role: 'EMPLOYER',
            headline: 'Senior Recruiter at Tech Corp',
            bio: 'We are looking for top talent.',
            location: 'San Francisco, CA',
        });

        await Profile.create({
            userId: employer.id,
            companyName: 'Tech Corp',
            companyUrl: 'https://techcorp.com',
            bio: 'Leading innovator in tech.',
        });

        // 3. Candidate
        const candidate = await User.create({
            email: 'candidate@example.com',
            password: hashedPassword,
            name: 'Jane Smith',
            role: 'CANDIDATE',
            headline: 'Full Stack Developer',
            bio: 'Passionate developer looking for new opportunities.',
            location: 'Austin, TX',
            skills: 'React, Node.js, TypeScript',
        });

        await Profile.create({
            userId: candidate.id,
            bio: 'I am a passionate developer.',
            skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
        });

        // 4. Jobs
        await Job.create({
            title: 'Senior Frontend Developer',
            description: 'We need a React expert with 5+ years of experience.',
            requirements: 'React, TypeScript, Tailwind CSS',
            salary: '$120k - $150k',
            location: 'Remote',
            type: 'FULL_TIME',
            employerId: employer.id,
        });

        await Job.create({
            title: 'Backend Engineer',
            description: 'Node.js and PostgreSQL experience required.',
            requirements: 'Node.js, Express, PostgreSQL, Sequelize',
            salary: '$130k - $160k',
            location: 'San Francisco, CA',
            type: 'FULL_TIME',
            employerId: employer.id,
        });

        console.log('Seeding finished successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await sequelize.close();
    }
};

seedDatabase();
