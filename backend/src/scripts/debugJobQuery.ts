
import { Job, User, Application, Profile } from '../models';
import sequelize from '../config/database';

const testQuery = async () => {
    try {
        await sequelize.authenticate();
        const userId = 1;

        // Ensure user exists (or find one)
        let user = await User.findByPk(userId);
        if (!user) {
            console.log('User 1 not found, finding first user...');
            user = await User.findOne();
            if (!user) {
                console.log('No users found. Creating one...');
                // Create a dummy user if absolutely empty DB
                // Omitted for brevity, assuming user 1 exists as per token
                return;
            }
        }

        console.log(`Using User ID: ${user.id}`);

        console.log('Creating a test job...');
        const job = await Job.create({
            title: 'Debug Developer',
            description: 'Testing the API',
            requirements: 'Node.js',
            salary: '$100k',
            location: 'Remote',
            type: 'FULL_TIME',
            employerId: user.id
        });
        console.log(`Created Job ID: ${job.id}`);

        console.log('Creating a test application...');
        // Need a candidate. Use same user for simplicity or create another.
        // If same user, candidateId = user.id.
        await Application.create({
            jobId: job.id,
            candidateId: user.id,
            status: 'APPLIED',
            resumeUrl: 'http://example.com',
            coverLetter: 'Test'
        });

        console.log('Running complex query...');
        const jobs = await Job.findAll({
            where: { employerId: user.id },
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
        console.log('Query Result:', JSON.stringify(jobs, null, 2));

    } catch (error) {
        console.error('Debug failed:', error);
    } finally {
        await sequelize.close();
    }
};

testQuery();
