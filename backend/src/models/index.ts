import User from './User';
import Profile from './Profile';
import Job from './Job';
import Application from './Application';

import Company from './Company';

// Associations
User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Company, { foreignKey: 'employerId', as: 'companies' });
Company.belongsTo(User, { foreignKey: 'employerId', as: 'employer' });

Company.hasMany(Job, { foreignKey: 'companyId', as: 'jobs' });
Job.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

User.hasMany(Job, { foreignKey: 'employerId', as: 'jobs' });
Job.belongsTo(User, { foreignKey: 'employerId', as: 'employer' });

Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

User.hasMany(Application, { foreignKey: 'candidateId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'candidateId', as: 'candidate' });

export { User, Profile, Job, Application, Company };
