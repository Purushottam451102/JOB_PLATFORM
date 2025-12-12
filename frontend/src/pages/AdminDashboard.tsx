import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Briefcase, FileText, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stats {
    users: number;
    jobs: number;
    applications: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

interface Job {
    id: number;
    title: string;
    employer: { name: string };
    location: string;
    createdAt: string;
}

const AdminDashboard = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState<Stats>({ users: 0, jobs: 0, applications: 0 });
    const [users, setUsers] = useState<User[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'jobs'>('users');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes, jobsRes] = await Promise.all([
                fetch('http://localhost:5000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/jobs', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const statsData = await statsRes.json();
            const usersData = await usersRes.json();
            const jobsData = await jobsRes.json();

            setStats(statsData);
            setUsers(usersData);
            setJobs(jobsData);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await fetch(`http://localhost:5000/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleDeleteJob = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            await fetch(`http://localhost:5000/api/jobs/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <Link
                    to="/jobs/create"
                    className="bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors flex items-center shadow-md font-medium"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Job
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex items-center transition-transform hover:scale-105">
                    <div className="p-4 bg-blue-100 rounded-full mr-5">
                        <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.users}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex items-center transition-transform hover:scale-105">
                    <div className="p-4 bg-green-100 rounded-full mr-5">
                        <Briefcase className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Jobs</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.jobs}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex items-center transition-transform hover:scale-105">
                    <div className="p-4 bg-purple-100 rounded-full mr-5">
                        <FileText className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Applications</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.applications}</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'users'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        User Management
                    </button>
                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'jobs'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Job Management
                    </button>
                </nav>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    {activeTab === 'users' ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{user.name}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{user.email}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                                    user.role === 'EMPLOYER' ? 'bg-green-100 text-green-800' :
                                                        'bg-blue-100 text-blue-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {user.role !== 'ADMIN' && (
                                                <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors" title="Delete User">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{job.title}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{job.employer?.name || 'Unknown'}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{job.location}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleDeleteJob(job.id)} className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors" title="Delete Job">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
