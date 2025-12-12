import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Briefcase, Building, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

interface Company {
    id: number;
    name: string;
    logo?: string;
}

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const { data } = await api.get('/companies');
                setCompanies(data);
            } catch (error) {
                console.error('Failed to fetch companies', error);
                // Fallback to static if fetch fails (optional, keeping minimal for now)
            }
        };
        fetchCompanies();
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/jobs');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            {/* Hero Section */}
            <section className="relative bg-transparent overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 z-0" />
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200 via-transparent to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                                #1 Job Board for Professionals
                            </span>
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
                                Find the job that <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                                    fits your life
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Connect with thousands of top employers and discover opportunities
                                that match your skills, experience, and aspirations.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="max-w-3xl mx-auto glass-card rounded-2xl p-3 flex items-center border border-gray-100/50 transform transition-all hover:shadow-2xl"
                        >
                            <Search className="h-6 w-6 text-gray-400 ml-4" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Job title, keywords, or company..."
                                className="flex-1 p-4 text-gray-900 placeholder-gray-400 focus:outline-none text-lg bg-transparent"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-500/30 flex items-center"
                            >
                                Search <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-12"
                        >
                            <p className="text-sm font-semibold text-gray-400 mb-6 uppercase tracking-wider">Trusted by Industry Leaders</p>

                            <div className="flex flex-wrap justify-center gap-8 items-center">
                                {companies.length > 0 ? (
                                    companies.map((company) => (
                                        <Link
                                            key={company.id}
                                            to={`/jobs?companyId=${company.id}`}
                                            className="group flex items-center space-x-2 transition-transform hover:-translate-y-1"
                                        >
                                            <div className="h-12 w-12 rounded-full overflow-hidden bg-white shadow-md border border-gray-100 flex items-center justify-center p-1">
                                                {company.logo ? (
                                                    <img src={company.logo} alt={company.name} className="h-full w-full object-cover rounded-full" />
                                                ) : (
                                                    <span className="text-lg font-bold text-indigo-600">{company.name.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <span className="text-lg font-bold text-gray-500 group-hover:text-indigo-600 transition-colors">
                                                {company.name.toUpperCase()}
                                            </span>
                                        </Link>
                                    ))
                                ) : (
                                    // Fallback / Placeholder if no companies exist yet
                                    <div className="flex gap-8 items-center justify-center flex-wrap text-gray-400 grayscale opacity-70">
                                        <span className="font-bold text-xl">GOOGLE</span>
                                        <span className="font-bold text-xl">MICROSOFT</span>
                                        <span className="font-bold text-xl">SPOTIFY</span>
                                        <span className="font-bold text-xl">AMAZON</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-transparent relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why JobPortal?</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">We provide the best tools and opportunities for your career growth.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <FeatureCard
                            icon={<Briefcase className="h-8 w-8 text-primary-600" />}
                            title="Thousands of Jobs"
                            description="Explore listings from top companies across various industries and find your perfect match."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<User className="h-8 w-8 text-primary-600" />}
                            title="Easy Application"
                            description="Create your profile once and apply to multiple jobs with just a single click."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Building className="h-8 w-8 text-primary-600" />}
                            title="Top Employers"
                            description="Connect directly with reputable companies that are actively looking for talent like you."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="p-8 glass-card rounded-2xl hover:bg-white/90 hover:shadow-xl transition-all border border-white/20 hover:border-gray-100 group"
    >
        <div className="h-14 w-14 bg-white text-primary-600 rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
);

export default Home;
