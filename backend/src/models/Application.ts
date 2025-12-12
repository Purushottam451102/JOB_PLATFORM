import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Job from './Job';

interface ApplicationAttributes {
    id: number;
    jobId: number;
    candidateId: number;
    status: 'APPLIED' | 'REVIEWING' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
    resumeUrl?: string;
    coverLetter?: string;
}

interface ApplicationCreationAttributes extends Optional<ApplicationAttributes, 'id' | 'status'> { }

class Application extends Model<ApplicationAttributes, ApplicationCreationAttributes> implements ApplicationAttributes {
    public id!: number;
    public jobId!: number;
    public candidateId!: number;
    public status!: 'APPLIED' | 'REVIEWING' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
    public resumeUrl!: string;
    public coverLetter!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Application.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        jobId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Job,
                key: 'id',
            },
        },
        candidateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        status: {
            type: DataTypes.ENUM('APPLIED', 'REVIEWING', 'INTERVIEW', 'OFFER', 'REJECTED'),
            defaultValue: 'APPLIED',
        },
        resumeUrl: DataTypes.STRING,
        coverLetter: DataTypes.TEXT,
    },
    {
        sequelize,
        tableName: 'Applications',
    }
);

export default Application;
