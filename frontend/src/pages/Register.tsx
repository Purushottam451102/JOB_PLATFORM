import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        gender: '',
        role: 'CANDIDATE' as 'CANDIDATE' | 'EMPLOYER'
    });

    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const { confirmPassword, ...submitData } = formData;
            const { data } = await api.post('/auth/register', submitData);
            login(data.token, data.user);
            navigate(formData.role === 'EMPLOYER' ? '/employer/dashboard' : '/');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full glass-card p-8 rounded-xl border border-white/50"
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-indigo-500 inline-block pb-1">
                    Registration
                </h2>

                {error && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Role Switcher (Kept minimal to fit design) */}
                <div className="flex justify-end mb-4">
                    <div className="inline-flex bg-gray-100 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'CANDIDATE' })}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${formData.role === 'CANDIDATE'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Candidate
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'EMPLOYER' })}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${formData.role === 'EMPLOYER'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Employer
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter your number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Gender</label>
                        <div className="flex space-x-8">
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="MALE"
                                    checked={formData.gender === 'MALE'}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-gray-700">Male</span>
                            </label>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="FEMALE"
                                    checked={formData.gender === 'FEMALE'}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-gray-700">Female</span>
                            </label>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="OTHER"
                                    checked={formData.gender === 'OTHER'}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-gray-700">Prefer not to say</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transform hover:scale-[1.01] transition-all"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Sign in instead
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
