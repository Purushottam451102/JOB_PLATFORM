import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Briefcase, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import LogoutModal from './LogoutModal';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const userRole = user?.role;

    const handleLogoutConfirm = () => {
        logout();
        setIsLogoutModalOpen(false);
        navigate('/login');
    };

    const handleFindJobsClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            navigate('/login');
        }
    };

    return (
        <>
            <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 fixed w-full top-0 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex-shrink-0 flex items-center gap-3 transition-transform hover:scale-105">
                                <img src="/job.png" alt="JobPortal Logo" className="h-12 w-auto object-contain drop-shadow-sm" />
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">JobLaunch</span>
                            </Link>
                        </div>

                        <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                            {userRole !== 'EMPLOYER' && (
                                <Link to="/jobs" onClick={handleFindJobsClick} className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                    Find Jobs
                                </Link>
                            )}
                            {isAuthenticated ? (
                                <>
                                    {userRole === 'EMPLOYER' ? (
                                        <>
                                            <Link to="/employer/dashboard" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                                Dashboard
                                            </Link>
                                            <Link to="/employer/applications" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                                Applications
                                            </Link>
                                            <Link to="/employer/companies/create" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                                Register Company
                                            </Link>
                                            <Link to="/jobs/create" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                                Post Job
                                            </Link>
                                        </>
                                    ) : (
                                        <Link to="/candidate/dashboard" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                            Dashboard
                                        </Link>
                                    )}
                                    <Link to="/profile" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => setIsLogoutModalOpen(true)}
                                        className="text-gray-500 hover:text-gray-900 p-2 rounded-full focus:outline-none"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex space-x-4">
                                    <Link to="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                        Login
                                    </Link>
                                    <Link to="/register" className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="sm:hidden">
                        <div className="pt-2 pb-3 space-y-1">
                            <Link to="/jobs" onClick={handleFindJobsClick} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700">
                                Find Jobs
                            </Link>
                            {!isAuthenticated && (
                                <>
                                    <Link to="/login" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700">
                                        Login
                                    </Link>
                                    <Link to="/register" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
            />
        </>
    );
};

export default Navbar;
