import sequelize from '../config/database';
import { User, Profile, Job, Application } from '../models';

const initializeModels = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync all models
        await sequelize.sync({ alter: true }); // 'alter' adjusts tables to match models
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error; // Re-throw to allow main app to handle failure
    }
};

export default initializeModels;
