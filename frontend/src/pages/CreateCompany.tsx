import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building, MapPin, Globe, FileText, AlertCircle, Camera } from 'lucide-react';
import api from '../api';

const CreateCompany = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website: '',
        location: '',
        logo: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                setError('File is too large (max 5MB)');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await api.post('/companies', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/employer/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create company');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-indigo-600 px-8 py-6">
                    <h1 className="text-2xl font-bold text-white flex items-center">
                        <Building className="h-6 w-6 mr-3" />
                        Register Your Company
                    </h1>
                    <p className="text-indigo-100 mt-2">Create a company profile to start posting jobs.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            {error}
                        </div>
                    )}

                    {/* Logo Section - Profile Style */}
                    <div className="flex flex-col items-center mb-6 max-w-fit mx-auto">
                        <div
                            className="relative inline-block cursor-pointer group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="w-32 h-32 rounded-full border-4 border-gray-100 shadow-md overflow-hidden bg-gray-50 flex items-center justify-center group-hover:border-indigo-200 transition-colors">
                                {formData.logo ? (
                                    <img src={formData.logo} alt="Company Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <Building className="h-12 w-12 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                                )}
                            </div>
                            <button
                                type="button"
                                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 transition-colors shadow-sm z-10"
                            >
                                <Camera className="h-5 w-5" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        <p
                            className="text-sm text-gray-500 mt-3 font-medium cursor-pointer hover:text-indigo-600 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Upload Company Logo
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="e.g. Acme Corp"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <Globe className="h-4 w-4 mr-1 text-gray-400" /> Website
                        </label>
                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="https://example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" /> Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="e.g. San Francisco, CA"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <FileText className="h-4 w-4 mr-1 text-gray-400" /> Description
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Tell us about your company..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md disabled:opacity-50"
                        >
                            {isLoading ? 'Creating...' : 'Create Company'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCompany;
