
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const createDb = async () => {
    // Connect to default 'postgres' database to create the new one
    const client = new Client({
        connectionString: process.env.DATABASE_URL?.replace('jobboard', 'postgres') || 'postgres://postgres:postgres@localhost:5432/postgres',
    });

    try {
        await client.connect();

        // Check if database exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'jobboard'");

        if (res.rowCount === 0) {
            console.log("Database 'jobboard' not found. Creating...");
            await client.query('CREATE DATABASE jobboard');
            console.log("Database 'jobboard' created successfully.");
        } else {
            console.log("Database 'jobboard' already exists.");
        }
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        await client.end();
    }
};

createDb();
