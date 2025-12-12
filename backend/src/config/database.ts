import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    dialectOptions: {
        ssl: process.env.DATABASE_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
    },
});

export default sequelize;
