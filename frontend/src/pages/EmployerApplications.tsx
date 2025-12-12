import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Briefcase, MapPin, CheckCircle, XCircle, Clock, ChevronDown, User, Calendar } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Application {
    id: number;
    status: string;
    createdAt: string;
    resumeUrl?: string;
    coverLetter?: string;
    job: {
        id: number;
        title: string;
        location: string;
        type: string;
    };
    candidate: {
        id: number;
        name: string;
        email: string;
        profile: {
            profilePicture?: string;
            bio?: string;
            skills?: string[];
            location?: string;
            phoneNumber?: string;
            githubUrl?: string;
            linkedinUrl?: string;
            headline?: string;
        }
    };
}

const EmployerApplications = () => {
    const { token } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [tempStatus, setTempStatus] = useState('');

    useEffect(() => {
        fetchApplications();
    }, [token]);

    useEffect(() => {
        if (selectedApplication) {
            setTempStatus(selectedApplication.status);
        }
    }, [selectedApplication]);

    const fetchApplications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/applications/employer', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            await axios.put(`http://localhost:5000/api/applications/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Optimistic update
            setApplications(applications.map(app =>
                app.id === id ? { ...app, status: newStatus } : app
            ));

            // Update selected application if open
            if (selectedApplication?.id === id) {
                // Close the modal upon successful save
                setSelectedApplication(null);
            }

            toast.success('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

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

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (isLoading) return <div className="p-10 text-center text-gray-500">Loading applications...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
                    <p className="text-gray-500 mt-1">Manage candidates across all your job postings</p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search applicant or job..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="APPLIED">New</option>
                        <option value="REVIEWING">Reviewing</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFER">Offer</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Applied For</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Applied</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredApplications.length > 0 ? (
                                filteredApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedApplication(app)}>
                                            <div className="flex items-center group">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold overflow-hidden border border-blue-100 group-hover:border-blue-400 transition-colors">
                                                    {app.candidate.profile.profilePicture ? (
                                                        <img src={app.candidate.profile.profilePicture} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        app.candidate.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{app.candidate.name}</div>
                                                    <div className="text-sm text-gray-500">{app.candidate.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{app.job.title}</div>
                                            <div className="text-xs text-gray-500 flex items-center mt-0.5">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {app.job.location} • {app.job.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedApplication(app)}
                                                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                        No applications found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Candidate Details Modal */}
            {selectedApplication && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">

                        <button
                            onClick={() => setSelectedApplication(null)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
                        >
                            <XCircle className="w-6 h-6 text-gray-500" />
                        </button>

                        <div className="p-8">
                            {/* Header */}
                            <div className="flex items-start gap-6 mb-8 border-b border-gray-100 pb-8">
                                <div className="h-24 w-24 rounded-full bg-blue-50 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-blue-600 overflow-hidden">
                                    {selectedApplication.candidate.profile.profilePicture ? (
                                        <img src={selectedApplication.candidate.profile.profilePicture} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        selectedApplication.candidate.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1 pt-2">
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedApplication.candidate.name}</h2>
                                    <p className="text-gray-500 text-lg">{selectedApplication.candidate.profile.headline || 'No headline'}</p>

                                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 mr-1.5 text-gray-400" />
                                            {selectedApplication.candidate.email}
                                        </div>
                                        {selectedApplication.candidate.profile.phoneNumber && (
                                            <div className="flex items-center">
                                                <span className="w-4 h-4 mr-1.5 flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-400 rounded-full">P</span>
                                                {selectedApplication.candidate.profile.phoneNumber}
                                            </div>
                                        )}
                                        {selectedApplication.candidate.profile.location && (
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                                                {selectedApplication.candidate.profile.location}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-8">
                                {/* About */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                        <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                                        About Candidate
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {selectedApplication.candidate.profile.bio || 'No bio provided.'}
                                    </p>
                                </div>

                                {/* Skills */}
                                {selectedApplication.candidate.profile.skills && selectedApplication.candidate.profile.skills.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                            <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
                                            Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {/* Handle skill string if it's not parsed as array, though TS says string[] */}
                                            {(Array.isArray(selectedApplication.candidate.profile.skills)
                                                ? selectedApplication.candidate.profile.skills
                                                : (selectedApplication.candidate.profile.skills as string).split(',')
                                            ).map((skill: string, index: number) => (
                                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Links */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(selectedApplication.candidate.profile.githubUrl || selectedApplication.candidate.profile.linkedinUrl) && (
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <h4 className="font-bold text-gray-900 mb-2">Social Profiles</h4>
                                            <div className="space-y-2">
                                                {selectedApplication.candidate.profile.githubUrl && (
                                                    <a href={selectedApplication.candidate.profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                                                        GitHub Profile <Clock className="w-3 h-3 ml-1 -rotate-45" />
                                                    </a>
                                                )}
                                                {selectedApplication.candidate.profile.linkedinUrl && (
                                                    <a href={selectedApplication.candidate.profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                                                        LinkedIn Profile <Clock className="w-3 h-3 ml-1 -rotate-45" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(selectedApplication.resumeUrl || selectedApplication.coverLetter) && (
                                        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                            <h4 className="font-bold text-gray-900 mb-2">Application Materials</h4>
                                            <div className="space-y-2">
                                                {selectedApplication.resumeUrl && (
                                                    <a href={selectedApplication.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-yellow-700 hover:text-yellow-900 font-medium">
                                                        View Resume <Clock className="w-3 h-3 ml-1 -rotate-45" />
                                                    </a>
                                                )}
                                                {selectedApplication.coverLetter && (
                                                    <div className="mt-2 text-xs text-yellow-800">
                                                        <span className="font-bold">Cover Letter:</span> {selectedApplication.coverLetter}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-6 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Applied for <span className="font-bold text-gray-900">{selectedApplication.job.title}</span> on {new Date(selectedApplication.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                    onClick={() => setSelectedApplication(null)}
                                >
                                    Close
                                </button>
                                <div className="relative group flex gap-2">
                                    <div className="relative">
                                        <select
                                            value={tempStatus}
                                            onChange={(e) => setTempStatus(e.target.value)}
                                            className="appearance-none bg-white border border-blue-200 text-gray-900 pl-4 pr-10 py-2 rounded-lg font-medium hover:border-blue-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <option value="APPLIED">Applied</option>
                                            <option value="REVIEWING">Reviewing</option>
                                            <option value="INTERVIEW">Interview</option>
                                            <option value="OFFER">Offer</option>
                                            <option value="REJECTED">Reject</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                            <ChevronDown className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedApplication.id, tempStatus)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={tempStatus === selectedApplication.status}
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployerApplications;
