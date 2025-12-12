import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CompanyAttributes {
    id: number;
    name: string;
    description?: string;
    website?: string;
    location?: string;
    logo?: string;
    employerId: number;
}

interface CompanyCreationAttributes extends Optional<CompanyAttributes, 'id'> { }

class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public website!: string;
    public location!: string;
    public logo!: string;
    public employerId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Company.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: DataTypes.TEXT,
    website: DataTypes.STRING,
    location: DataTypes.STRING,
    logo: DataTypes.TEXT,
    employerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'Companies'
});

export default Company;
