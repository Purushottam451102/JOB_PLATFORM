import sequelize from '../config/database';
import { User, Profile, Job, Application, Company } from '../models';

const syncDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync models
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully (Tables updated).');
    } catch (error) {
        console.error('Error syncing database:', error);
    } finally {
        await sequelize.close();
    }
};

syncDb();
