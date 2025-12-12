import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { MapPin, Briefcase, DollarSign, Clock, Building } from 'lucide-react';
import { motion } from 'framer-motion';

interface Job {
    id: number;
    title: string;
    description: string;
    type: string;
    location: string;
    salary: string;
    createdAt: string;
    employer: {
        name: string;
    };
    company?: {
        id: number;
        name: string;
        logo?: string;
    };
}

const JobListing: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    // Get filter params
    const companyIdParam = searchParams.get('companyId');
    const searchParam = searchParams.get('search') || '';

    const [searchTerm, setSearchTerm] = useState(searchParam);

    useEffect(() => {
        setSearchTerm(searchParam);
    }, [searchParam]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data } = await api.get('/jobs');
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        // Filter by Search Term
        const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.employer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

        // Filter by Company ID
        const matchesCompany = companyIdParam
            ? job.company?.id === Number(companyIdParam)
            : true;

        return matchesSearch && matchesCompany;
    });

    const activeCompany = companyIdParam && jobs.find(j => j.company?.id === Number(companyIdParam))?.company;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {activeCompany ? `${activeCompany.name} Jobs` : 'Latest Opportunities'}
                    </h1>
                    {activeCompany && (
                        <Link to="/jobs" className="text-sm text-primary-600 hover:text-primary-800 mt-1 inline-block">
                            &larr; View all jobs
                        </Link>
                    )}
                </div>

                <div className="w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/90 backdrop-blur-sm shadow-sm text-gray-900 placeholder-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="glass-card rounded-xl border border-gray-100/50 p-6 hover:shadow-lg transition-all duration-300 hover:border-primary-100 group"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {job.company?.logo ? (
                                                <img src={job.company.logo} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-100 shadow-sm" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                                    <Building className="w-4 h-4 text-indigo-600" />
                                                </div>
                                            )}
                                            <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                                                {job.company?.name || job.employer.name}
                                            </span>
                                        </div>

                                        <Link to={`/jobs/${job.id}`} className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
                                            {job.title}
                                        </Link>

                                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center">
                                                <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                                                {job.type.replace('_', ' ')}
                                            </div>
                                            {job.salary && (
                                                <div className="flex items-center">
                                                    <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                                                    {job.salary}
                                                </div>
                                            )}
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 md:mt-0 ml-0 md:ml-4 flex items-center">
                                        <Link
                                            to={`/jobs/${job.id}`}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                            <p className="text-gray-500 mt-1">Try adjusting your search criteria or clear filters.</p>
                            {(searchTerm || companyIdParam) && (
                                <Link to="/jobs" className="mt-4 inline-block text-primary-600 hover:underline">Clear all filters</Link>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobListing;
