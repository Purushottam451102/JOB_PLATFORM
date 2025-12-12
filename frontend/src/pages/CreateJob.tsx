import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, DollarSign, FileText, CheckCircle, AlertCircle, Building, Plus } from 'lucide-react';
import api from '../api';

interface Company {
    id: number;
    name: string;
}

const CreateJob = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingCompanies, setIsFetchingCompanies] = useState(true);
    const [error, setError] = useState('');
    const [companies, setCompanies] = useState<Company[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        type: 'FULL_TIME',
        companyId: ''
    });

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const { data } = await api.get('/companies/my-companies', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCompanies(data);

                // Pre-select company from URL param or default to first
                const urlCompanyId = searchParams.get('companyId');

                if (urlCompanyId && data.some((c: Company) => c.id === Number(urlCompanyId))) {
                    setFormData(prev => ({ ...prev, companyId: urlCompanyId }));
                } else if (data.length > 0) {
                    setFormData(prev => ({ ...prev, companyId: String(data[0].id) }));
                }
            } catch (err) {
                console.error('Error fetching companies:', err);
                setError('Failed to load companies');
            } finally {
                setIsFetchingCompanies(false);
            }
        };
        fetchCompanies();
    }, [token, searchParams]);

    const jobTypes = [
        { value: 'FULL_TIME', label: 'Full Time' },
        { value: 'PART_TIME', label: 'Part Time' },
        { value: 'CONTRACT', label: 'Contract' },
        { value: 'INTERNSHIP', label: 'Internship' },
        { value: 'REMOTE', label: 'Remote' }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!formData.companyId) {
            setError('Please select a company.');
            setIsLoading(false);
            return;
        }

        try {
            await api.post('/jobs', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate('/employer/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create job');
        } finally {
            setIsLoading(false);
        }
    };

    if (companies.length === 0 && !isFetchingCompanies) {
        // Keep a version of the empty state, or handle it in the UI sections?
        // User asked for "create company" section, so we can show that even if no companies exist.
    }

    if (isFetchingCompanies) {
        return <div className="p-10 text-center text-gray-500">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Briefcase className="h-8 w-8 mr-3 text-primary-600" />
                Post a New Job
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center rounded-r-md">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Section 1: Company Selection */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Building className="h-5 w-5 mr-2 text-indigo-600" />
                            1. Company Information
                        </h2>
                        <button
                            type="button"
                            onClick={() => navigate('/employer/companies/create')}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors"
                        >
                            <Plus className="h-4 w-4 mr-1" /> Create New Company
                        </button>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-gray-500 mb-4">Select the company profile you are recruiting for. All job postings must be attached to a verified company.</p>

                        {companies.length === 0 ? (
                            <div className="text-center py-8 bg-indigo-50/50 rounded-xl border-2 border-dashed border-indigo-100">
                                <Building className="h-10 w-10 text-indigo-200 mx-auto mb-3" />
                                <p className="text-gray-900 font-medium mb-1">No companies found</p>
                                <p className="text-sm text-gray-500 mb-4">You need to create a company profile before posting a job.</p>
                                <button
                                    type="button"
                                    onClick={() => navigate('/employer/companies/create')}
                                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md transition-all hover:-translate-y-0.5"
                                >
                                    Create Your First Company
                                </button>
                            </div>
                        ) : (
                            <div className="max-w-md">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Company</label>
                                <div className="relative">
                                    <select
                                        name="companyId"
                                        value={formData.companyId}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
                                    >
                                        <option value="">-- Choose a Company --</option>
                                        {companies.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 2: Job Details */}
                <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${!formData.companyId ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                            2. Job Details
                        </h2>
                        {!formData.companyId && (
                            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                                Select a company to unlock
                            </span>
                        )}
                    </div>

                    <div className="p-6 space-y-6 relative">
                        {!formData.companyId && (
                            <div className="absolute inset-0 z-10 bg-white/20 cursor-not-allowed" />
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Job Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    disabled={!formData.companyId}
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                                    placeholder="e.g. Senior React Developer"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Job Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    disabled={!formData.companyId}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                                >
                                    {jobTypes.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <MapPin className="h-4 w-4 mr-1 text-gray-400" /> Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    disabled={!formData.companyId}
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                                    placeholder="e.g. Remote, New York, NY"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1 text-gray-400" /> Salary Range
                                </label>
                                <input
                                    type="text"
                                    name="salary"
                                    value={formData.salary}
                                    disabled={!formData.companyId}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                                    placeholder="e.g. $100k - $120k"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <FileText className="h-4 w-4 mr-1 text-gray-400" /> Description
                            </label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                disabled={!formData.companyId}
                                value={formData.description}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                                placeholder="Describe the role and responsibilities..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1 text-gray-400" /> Requirements
                            </label>
                            <textarea
                                name="requirements"
                                rows={3}
                                disabled={!formData.companyId}
                                value={formData.requirements}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                                placeholder="List key requirements..."
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mr-4 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !formData.companyId}
                        className="px-8 py-3 text-sm font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        {isLoading ? 'Posting...' : 'Post Job'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateJob;
