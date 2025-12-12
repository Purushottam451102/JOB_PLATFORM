import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, DollarSign, Users, Building, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

interface Job {
    id: number;
    title: string;
    location: string;
    type: string;
    salary: string;
    createdAt: string;
    applicationCount: string | number;
    companyId: number;
}

interface Company {
    id: number;
    name: string;
    location: string;
    website?: string;
    description?: string;
    logo?: string;
}

const EmployerDashboard = () => {
    const { token } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetching ALL companies and ALL jobs
                const [jobsRes, companiesRes] = await Promise.all([
                    api.get('/jobs'),
                    api.get('/companies')
                ]);
                setJobs(jobsRes.data);
                setCompanies(companiesRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) fetchData();
    }, [token]);

    // Scroll to jobs when a company is selected
    const jobsSectionRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedCompanyId && jobsSectionRef.current) {
            jobsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedCompanyId]);

    const getCompanyName = (id: number) => companies.find(c => c.id === id)?.name || 'Unknown Company';

    const displayedJobs = selectedCompanyId
        ? jobs.filter(job => job.companyId === selectedCompanyId)
        : jobs;

    if (isLoading) return <div className="p-12 text-center text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
                    <p className="text-gray-500 mt-1">View all registered companies and their jobs</p>
                </div>
            </div>

            {/* Section 1: All Companies */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-primary-600" />
                    All Registered Companies
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            onClick={() => setSelectedCompanyId(selectedCompanyId === company.id ? null : company.id)}
                            className={`
                                relative glass-card rounded-[20px] p-6 cursor-pointer transition-all duration-200 group border
                                ${selectedCompanyId === company.id
                                    ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-md'
                                    : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                                }
                            `}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-indigo-50 rounded-lg overflow-hidden h-16 w-16 flex items-center justify-center">
                                    {(company as any).logo ? (
                                        <img src={(company as any).logo} alt={company.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Building className="h-8 w-8 text-indigo-600" />
                                    )}
                                </div>
                                {selectedCompanyId === company.id && (
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Selected</span>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{company.name}</h3>

                            <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 opacity-70" />
                                    {company.location || 'No location set'}
                                </div>
                                {company.website && (
                                    <div className="flex items-center">
                                        <Globe className="h-4 w-4 mr-2 opacity-70" />
                                        <a href={company.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:underline hover:text-indigo-600">
                                            {company.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-400">
                                    {jobs.filter(j => j.companyId === company.id).length} Active Jobs
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 2: Job Listings */}
            <div ref={jobsSectionRef} className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <Briefcase className="h-5 w-5 mr-2 text-primary-600" />
                        {selectedCompanyId
                            ? `Jobs at ${getCompanyName(selectedCompanyId)}`
                            : 'All Job Postings'}
                    </h2>
                    {selectedCompanyId && (
                        <button
                            onClick={() => setSelectedCompanyId(null)}
                            className="text-sm text-gray-500 hover:text-indigo-600 font-medium"
                        >
                            View All Jobs
                        </button>
                    )}
                </div>

                {displayedJobs.length === 0 ? (
                    <div className="glass-card rounded-[20px] border border-dashed border-gray-300 p-12 text-center">
                        <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No jobs found for this selection.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {displayedJobs.map((job) => (
                            <div key={job.id} className="glass-card rounded-[20px] p-8 mb-8 border border-gray-100/50 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedCompanyId ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}
                                            >
                                                {getCompanyName(job.companyId)}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                            <div className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1" />{job.location}</div>
                                            <div className="flex items-center"><Briefcase className="h-3.5 w-3.5 mr-1" />{job.type}</div>
                                            {job.salary && <div className="flex items-center"><DollarSign className="h-3.5 w-3.5 mr-1" />{job.salary}</div>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end text-primary-600 font-bold mb-3">
                                            <Users className="h-5 w-5 mr-1.5" />
                                            {job.applicationCount || 0} Applicants
                                        </div>
                                        <Link to={`/jobs/${job.id}`} className="text-sm font-medium text-gray-900 hover:text-primary-600 underline decoration-gray-300 underline-offset-4">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployerDashboard;
