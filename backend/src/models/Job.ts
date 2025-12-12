import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface JobAttributes {
    id: number;
    title: string;
    description: string;
    requirements?: string;
    salary?: string;
    location: string;
    type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
    employerId: number;
    companyId?: number;
}

interface JobCreationAttributes extends Optional<JobAttributes, 'id'> { }

class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public requirements!: string;
    public salary!: string;
    public location!: string;
    public type!: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
    public employerId!: number;
    public companyId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Job.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        requirements: DataTypes.TEXT,
        salary: DataTypes.STRING,
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE'),
            allowNull: false, // Changed from defaultValue to allowNull: false
        },
        employerId: { // Keeping for backward compatibility or direct ownership
            type: DataTypes.INTEGER,
            allowNull: false,
            // Removed references block as per instruction
        },
        companyId: { // Added companyId
            type: DataTypes.INTEGER,
            allowNull: true, // Allow null initially for migration, but logic should enforce it
        }
    },
    {
        sequelize,
        tableName: 'Jobs',
    }
);

export default Job;
