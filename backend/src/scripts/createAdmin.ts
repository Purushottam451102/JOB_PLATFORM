import sequelize from '../config/database';
import { User, Profile } from '../models';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        const email = 'admin@example.com';
        const password = 'adminpassword123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const [admin, created] = await User.findOrCreate({
            where: { email },
            defaults: {
                name: 'System Administrator',
                password: hashedPassword,
                role: 'ADMIN',
                email: email,
                username: 'admin',
                gender: 'OTHER',
                phoneNumber: '0000000000',
                location: 'Headquarters'
            }
        });

        if (created) {
            await Profile.create({ userId: admin.id });
            console.log('✅ Admin user created successfully.');
        } else {
            console.log('ℹ️ Admin user already exists.');
            // Optional: Reset password if it exists
            admin.password = hashedPassword;
            admin.role = 'ADMIN'; // Ensure role is ADMIN
            await admin.save();
            console.log('✅ Admin user updated.');
        }

        console.log(`
        ----------------------------------------
        Admin Credentials:
        Email: ${email}
        Password: ${password}
        ----------------------------------------
        `);

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await sequelize.close();
    }
};

createAdmin();
