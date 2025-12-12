import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
    id: number;
    email: string;
    password?: string;
    name: string;
    username?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    role: 'CANDIDATE' | 'EMPLOYER';
    headline?: string;
    bio?: string;
    location?: string;
    phoneNumber?: string;
    skills?: string;
    profilePicture?: string;
    githubUrl?: string;
    linkedinUrl?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public password!: string;
    public name!: string;
    public username!: string;
    public gender!: 'MALE' | 'FEMALE' | 'OTHER';
    public role!: 'CANDIDATE' | 'EMPLOYER';
    public headline!: string;
    public bio!: string;
    public location!: string;
    public phoneNumber!: string;
    public skills!: string;
    public profilePicture!: string;
    public githubUrl!: string;
    public linkedinUrl!: string;

    public profile?: any;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
        gender: {
            type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
        },
        role: {
            type: DataTypes.ENUM('CANDIDATE', 'EMPLOYER'),
            defaultValue: 'CANDIDATE',
        },
        headline: DataTypes.STRING,
        bio: DataTypes.TEXT,
        location: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        skills: DataTypes.TEXT,
        profilePicture: DataTypes.TEXT,
        githubUrl: DataTypes.STRING,
        linkedinUrl: DataTypes.STRING,
    },
    {
        sequelize,
        tableName: 'Users',
    }
);

export default User;
