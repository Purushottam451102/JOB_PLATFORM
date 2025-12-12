import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Briefcase, DollarSign, Clock, Building, ArrowLeft } from 'lucide-react';

interface Job {
    id: number;
    title: string;
    description: string;
    requirements: string;
    type: string;
    location: string;
    salary: string;
    createdAt: string;
    employer: {
        name: string;
        email: string;
    };
    company?: {
        name: string;
        logo: string;
        location: string;
    };
}

const JobDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await api.get(`/jobs/${id}`);
                setJob(data);
            } catch (error) {
                console.error('Error fetching job:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user?.role === 'EMPLOYER') {
            alert("Employers cannot apply for jobs.");
            return;
        }

        setApplying(true);
        try {
            // Simple apply with no extra data for MVP, or open a modal
            // For now assume direct apply or ask for resume
            await api.post('/applications', { jobId: job?.id }); // Resume URL?
            alert('Application submitted successfully!');
            navigate('/candidate/dashboard');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!job) return <div className="p-10 text-center">Job not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                            <div className="flex items-center text-lg text-gray-700 font-medium mt-2">
                                {job.company?.logo ? (
                                    <img
                                        src={job.company.logo}
                                        alt={job.company.name}
                                        className="h-10 w-10 rounded-full object-cover border border-gray-200 mr-3"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                        <Building className="h-5 w-5 text-gray-500" />
                                    </div>
                                )}
                                <span className="text-gray-900 font-semibold">
                                    {job.company?.name || "Hiring Company"}
                                </span>
                            </div>
                        </div>
                        {isAuthenticated && user?.role === 'CANDIDATE' && (
                            <button
                                onClick={handleApply}
                                disabled={applying}
                                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition disabled:opacity-50"
                            >
                                {applying ? 'Applying...' : 'Apply Now'}
                            </button>
                        )}
                        {!isAuthenticated && (
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition"
                            >
                                Apply Now
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center text-gray-600">
                            <MapPin className="h-5 w-5 mr-2 text-primary-500" />
                            {job.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Briefcase className="h-5 w-5 mr-2 text-primary-500" />
                            {job.type}
                        </div>
                        {job.salary && (
                            <div className="flex items-center text-gray-600">
                                <DollarSign className="h-5 w-5 mr-2 text-primary-500" />
                                {job.salary}
                            </div>
                        )}
                        <div className="flex items-center text-gray-600">
                            <Clock className="h-5 w-5 mr-2 text-primary-500" />
                            {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="prose max-w-none text-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                        <p className="whitespace-pre-line mb-6">{job.description}</p>

                        {job.requirements && (
                            <>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                                <p className="whitespace-pre-line">{job.requirements}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
