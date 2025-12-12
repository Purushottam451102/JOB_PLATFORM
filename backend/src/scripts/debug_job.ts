
import axios from 'axios';

async function testCreateJob() {
    try {
        console.log('🔑 Logging in to get valid token...');
        // Login as 'emp1765368265840@test.com' created in previous run, or register a new one.
        // Let's just register a new one to be clean.
        const suffix = Date.now();
        const userPayload = {
            name: `EmpJob${suffix}`,
            email: `empjob${suffix}@test.com`,
            password: 'password123',
            role: 'EMPLOYER'
        };

        const regRes = await axios.post('http://localhost:5000/api/auth/register', userPayload);
        const token = regRes.data.token;
        const userId = regRes.data.user.id;
        console.log(`✅ Registered User ${userId} (${userPayload.email}) - Token acquired`);

        // 1. Create a Company (since new user has none)
        const companyPayload = {
            name: "Debug Corp",
            location: "Debug City",
            description: "Debugging Inc."
        };
        const companyRes = await axios.post('http://localhost:5000/api/companies', companyPayload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const companyId = companyRes.data.id;
        console.log(`✅ Created Company ${companyId} (${companyRes.data.name})`);

        // 2. Create Job
        const jobPayload = {
            title: "Senior Debugger",
            description: "Fixing bugs in production",
            requirements: "Node.js, TypeScript",
            salary: "$150k",
            location: "Remote",
            type: "FULL_TIME",
            companyId: companyId
        };
        console.log('🚀 Attempting to create job for Company:', companyId);

        const jobRes = await axios.post('http://localhost:5000/api/jobs', jobPayload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Job Created Successfully');
        console.log(jobRes.data);

    } catch (error: any) {
        console.error('❌ Failed');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

testCreateJob();
