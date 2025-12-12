import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Calendar, Building, Search, Filter, MapPin, DollarSign, Clock, User, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Application {
    id: number;
    jobId: number;
    status: string;
    createdAt: string;
    job: {
        id: number;
        title: string;
        location: string;
        type: string;
        salary: string;
        employer: {
            name: string;
            email: string;
        };
    };
}

interface Job {
    id: number;
    title: string;
    employer: { name: string };
    location: string;
    type: string;
    salary: string;
    createdAt: string;
}

const CandidateDashboard = () => {
    const { user, token } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [recentJobs, setRecentJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appRes, jobsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/applications/my', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch('http://localhost:5000/api/jobs', { // Fetching all jobs for recommendations
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                const appData = await appRes.json();
                const jobsData = await jobsRes.json();

                setApplications(appData);
                // Simple recommendation: Take first 5 jobs that user hasn't applied to
                const appliedJobIds = new Set(appData.map((a: Application) => a.jobId));
                setRecentJobs(jobsData.filter((j: Job) => !appliedJobIds.has(j.id)).slice(0, 4));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) fetchData();
    }, [token]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPLIED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'REVIEWING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'INTERVIEW': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'OFFER': return 'bg-green-100 text-green-800 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredApplications = filterStatus === 'ALL'
        ? applications
        : applications.filter(app => app.status === filterStatus);

    const stats = {
        total: applications.length,
        interview: applications.filter(a => a.status === 'INTERVIEW').length,
        offers: applications.filter(a => a.status === 'OFFER').length
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
                </div>
                <Link to="/jobs" className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center font-medium">
                    <Search className="w-4 h-4 mr-2" /> Find Jobs
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 rounded-xl border border-gray-100/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-400">Total</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-sm text-gray-500 mt-1">Applications Submitted</div>
                </div>
                <div className="glass-card p-6 rounded-xl border border-gray-100/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-400">Action</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stats.interview}</div>
                    <div className="text-sm text-gray-500 mt-1">Interviews Scheduled</div>
                </div>
                <div className="glass-card p-6 rounded-xl border border-gray-100/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-50 p-3 rounded-lg text-green-600">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-400">Success</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stats.offers}</div>
                    <div className="text-sm text-gray-500 mt-1">Job Offers</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Applications */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card rounded-xl border border-gray-100/50 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
                            <div className="flex items-center space-x-2">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <select
                                    className="bg-transparent text-sm font-medium text-gray-600 focus:outline-none cursor-pointer"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="APPLIED">Applied</option>
                                    <option value="INTERVIEW">Interview</option>
                                    <option value="OFFER">Offer</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>
                        </div>

                        {filteredApplications.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredApplications.map((app) => (
                                    <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-start">
                                                <div className="bg-gray-100 p-3 rounded-lg mr-4">
                                                    <Building className="w-6 h-6 text-gray-500" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{app.job.title}</h3>
                                                    <p className="text-sm text-gray-500 font-medium">{app.job.employer.name}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <div className="ml-14 flex items-center gap-6 mt-3">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                                {app.job.location}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <DollarSign className="w-3.5 h-3.5 mr-1" />
                                                {app.job.salary}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-400 ml-auto">
                                                <Clock className="w-3.5 h-3.5 mr-1.5" />
                                                Applied {new Date(app.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No applications found matching your filter.
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Recommendations */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-2">Complete Your Profile</h3>
                        <p className="text-blue-100 text-sm mb-4">A complete profile increases your chances of getting hired by 70%.</p>
                        <Link to="/profile" className="w-full block text-center bg-white text-blue-600 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors">
                            Update Profile
                        </Link>
                    </div>

                    <div className="glass-card rounded-xl border border-gray-100/50 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Recommended Jobs</h3>
                        <div className="space-y-4">
                            {recentJobs.length > 0 ? (
                                recentJobs.map((job) => (
                                    <Link key={job.id} to={`/jobs/${job.id}`} className="block group">
                                        <div className="flex items-start p-3 -mx-3 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="bg-gray-100 p-2 rounded mr-3">
                                                <Briefcase className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h4>
                                                <p className="text-xs text-gray-500 mb-1">{job.employer.name}</p>
                                                <div className="flex items-center text-xs text-gray-400">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {job.location}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic">No recommendations available.</p>
                            )}
                        </div>
                        <Link to="/jobs" className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700 mt-4 border-t pt-4">
                            View All Jobs
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
