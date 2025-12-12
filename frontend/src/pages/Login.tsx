import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.token, data.user);

            if (data.user.role === 'EMPLOYER') {
                navigate('/employer/dashboard');
            } else {
                navigate('/candidate/dashboard');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-xl border border-white/50 relative z-10"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mx-auto h-16 w-16 bg-gradient-to-tr from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6"
                    >
                        <Lock className="h-8 w-8 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                            Create a free account
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center rounded-r-md"
                        >
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600">
                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600">
                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50"
                        >
                            <span className="flex items-center">
                                {loading ? 'Signing in...' : 'Sign In'}
                                {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
