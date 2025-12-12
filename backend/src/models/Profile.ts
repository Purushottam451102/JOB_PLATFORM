import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface ProfileAttributes {
    id: number;
    userId: number;
    bio?: string;
    resumeUrl?: string;
    skills?: string[];
    companyName?: string;
    companyUrl?: string;
    workExperience?: any[];
    jobPreferences?: any;
    profileStats?: any;
}

interface ProfileCreationAttributes extends Optional<ProfileAttributes, 'id'> { }

class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
    public id!: number;
    public userId!: number;
    public bio!: string;
    public resumeUrl!: string;
    public skills!: string[];
    public companyName!: string;
    public companyUrl!: string;
    public workExperience!: any[];
    public jobPreferences!: any;
    public profileStats!: any;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Profile.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: User,
                key: 'id',
            },
        },
        bio: DataTypes.TEXT,
        resumeUrl: DataTypes.STRING,
        skills: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
        },
        companyName: DataTypes.STRING,
        companyUrl: DataTypes.STRING,
        workExperience: {
            type: DataTypes.JSON,
            defaultValue: [],
        },
        jobPreferences: {
            type: DataTypes.JSON,
            defaultValue: {},
        },
        profileStats: {
            type: DataTypes.JSON,
            defaultValue: {},
        }
    },
    {
        sequelize,
        tableName: 'Profiles',
    }
);

export default Profile;
