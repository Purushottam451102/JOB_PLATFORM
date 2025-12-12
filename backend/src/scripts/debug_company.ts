
import axios from 'axios';
import { User } from '../models'; // We won't use this directly but good to have if needed for direct DB check
import jwt from 'jsonwebtoken';

const TEST_SECRET = process.env.JWT_SECRET || 'secret_key'; // Use env or fallback

async function testCreateCompany() {
    try {
        // 1. Create a dummy token for testing (assuming we have a user, or we can just sign one)
        // We need a valid userId. Let's assume User ID 1 exists and is an Employer (based on previous logs/seeds)
        // Or better, let's login first.

        // Quick Mock Token if we know ID 2 is Employer from the curl command: "userId":2,"role":"EMPLOYER"
        const token = jwt.sign({ userId: 2, role: 'EMPLOYER' }, 'secret_key', { expiresIn: '1h' });
        // Note: 'secret_key' must match the server's .env JWT_SECRET. 
        // If I don't know the server's secret, I must rely on the server running with 'secret_key' or I should try to Login first.

        // Let's try to register/login a fresh user to be sure.
        const suffix = Date.now();
        const userPayload = {
            name: `Emp${suffix}`,
            email: `emp${suffix}@test.com`,
            password: 'password123',
            role: 'EMPLOYER'
        };

        let authToken = '';

        try {
            const regRes = await axios.post('http://localhost:5000/api/auth/register', userPayload);
            authToken = regRes.data.token;
            console.log('✅ Registered new employer:', userPayload.email);
        } catch (e) {
            console.log('User might accept login, trying login...');
            const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
                email: userPayload.email,
                password: userPayload.password
            });
            authToken = loginRes.data.token;
        }

        // 2. Send the Payload
        const companyPayload = {
            name: "Tech Samartha",
            description: "We are build full stack appilcation ",
            website: "www.techsamartha.comhttp://localhost:5173/employer/companies/create",
            location: "Pune",
            logo: ""
        };

        console.log('Attemping to create company with token:', authToken.substring(0, 20) + '...');

        const res = await axios.post('http://localhost:5000/api/companies', companyPayload, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log('✅ Company Created Successfully');
        console.log(res.data);

    } catch (error: any) {
        console.error('❌ Failed to create company');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

testCreateCompany();
