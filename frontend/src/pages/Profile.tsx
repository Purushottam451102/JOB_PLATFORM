import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Camera, Edit2, Trash2, MapPin, Phone, Linkedin, Github, Briefcase, Calendar, DollarSign, Clock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface WorkExperience {
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    location: string;
    description: string;
}

interface ProfileData {
    name: string;
    email: string;
    headline: string;
    bio: string;
    location: string;
    phoneNumber: string;
    skills: string | string[];
    githubUrl: string;
    linkedinUrl: string;
    gender?: string;
    profilePicture?: string;
    profile?: {
        workExperience?: WorkExperience[];
        jobPreferences?: {
            availability?: string;
            expectedSalary?: string;
            education?: string;
            addressLine1?: string;
            addressLine2?: string;
            postcode?: string;
            state?: string;
            area?: string;
            country?: string;
            stateRegion?: string;
        };
        profileStats?: {
            views?: number;
            applications?: number;
            savedJobs?: number;
            completeness?: number;
        };
    };
}

const Profile = () => {
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Split name for the form view
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');

    const [formData, setFormData] = useState<ProfileData>({
        name: '',
        email: '',
        headline: '',
        bio: '',
        location: '',
        phoneNumber: '',
        skills: [],
        githubUrl: '',
        linkedinUrl: '',
        gender: '',
        profilePicture: '',
        profile: {
            workExperience: [],
            jobPreferences: {
                availability: 'Available for new opportunities',
                expectedSalary: '$120,000 - $150,000',
                education: '',
                addressLine1: '',
                addressLine2: '',
                postcode: '',
                state: '',
                area: '',
                country: '',
                stateRegion: ''
            },
            profileStats: {
                views: 0,
                applications: 0,
                savedJobs: 0,
                completeness: 0
            }
        }
    });

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('https://job-platform-2-k4om.onrender.com/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data;
                const updatedData = {
                    ...formData,
                    ...data,
                    // Ensure nested objects exist and merge
                    profile: {
                        ...formData.profile,
                        ...data.profile,
                        workExperience: data.profile?.workExperience || [],
                        jobPreferences: {
                            ...formData.profile?.jobPreferences,
                            ...(data.profile?.jobPreferences || {})
                        },
                        profileStats: {
                            ...formData.profile?.profileStats,
                            ...(data.profile?.profileStats || {})
                        }
                    }
                };
                setFormData(updatedData);

                // Split name
                const names = (data.name || '').split(' ');
                setFirstName(names[0] || '');
                setSurname(names.slice(1).join(' ') || '');

            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Failed to load profile');
            } finally {
                setIsLoading(false);
            }
        };
        if (token) fetchProfile();
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePreferenceChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                jobPreferences: {
                    ...prev.profile?.jobPreferences,
                    [field]: value
                }
            }
        }));
    };

    const handleExperienceChange = (index: number, field: keyof WorkExperience, value: string | boolean) => {
        const updatedExp = [...(formData.profile?.workExperience || [])];
        updatedExp[index] = { ...updatedExp[index], [field]: value };
        setFormData(prev => ({
            ...prev,
            profile: { ...prev.profile, workExperience: updatedExp }
        }));
    };

    const addExperience = () => {
        const newExp: WorkExperience = {
            title: '',
            company: '',
            startDate: '',
            endDate: '',
            current: false,
            location: '',
            description: ''
        };
        setFormData(prev => ({
            ...prev,
            profile: { ...prev.profile, workExperience: [newExp, ...(prev.profile?.workExperience || [])] }
        }));
    };

    const removeExperience = (index: number) => {
        const updatedExp = [...(formData.profile?.workExperience || [])];
        updatedExp.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            profile: { ...prev.profile, workExperience: updatedExp }
        }));
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            // Combine name
            const fullName = `${firstName} ${surname}`.trim();

            // Construct display location from detailed address fields if available
            const jp = formData.profile?.jobPreferences;
            let displayLocation = formData.location;
            if (jp?.country || jp?.state) {
                const parts = [];
                if (jp.state) parts.push(jp.state);
                if (jp.country) parts.push(jp.country);
                displayLocation = parts.join(', ');
            }

            // Prepare payload
            const payload = {
                ...formData,
                name: fullName,
                location: displayLocation,
                workExperience: formData.profile?.workExperience,
                jobPreferences: formData.profile?.jobPreferences
            };

            await axios.put('https://job-platform-2-k4om.onrender.com/api/users/profile', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Profile updated successfully');

            // Re-fetch or update local state details
            setFormData(prev => ({ ...prev, name: fullName, location: displayLocation || prev.location }));

            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile');
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    // Helper to format full address for display
    const getFullAddress = () => {
        const jp = formData.profile?.jobPreferences;
        if (!jp) return null;
        const parts = [jp.addressLine1, jp.addressLine2, jp.area, jp.state, jp.postcode, jp.country].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : null;
    };

    if (isLoading) return <div className="p-12 text-center text-gray-500">Loading profile...</div>;

    // View Mode (Same as before)
    if (!isEditing) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
                {/* Header Card */}
                <div className="glass-card rounded-[20px] p-8 mb-6 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6">
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md shadow-blue-200">
                            <Edit2 className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>

                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-gray-50 shadow-lg overflow-hidden relative bg-gray-100">
                            {formData.profilePicture ? (
                                <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <UserIcon className="w-16 h-16" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 text-center md:text-left pt-2">
                        <h1 className="text-3xl font-bold text-gray-900">{formData.name || 'Your Name'}</h1>
                        <p className="text-lg text-gray-500 mt-1">{formData.headline || 'Add a headline'}</p>

                        <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start text-gray-600 text-sm">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {formData.location || 'Location'}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {formData.email}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Phone className="w-4 h-4 text-gray-400" />
                                {formData.phoneNumber || 'Phone'}
                            </div>
                            {formData.gender && (
                                <div className="flex items-center gap-1.5 capitalize">
                                    <UserIcon className="w-4 h-4 text-gray-400" />
                                    {formData.gender.toLowerCase()}
                                </div>
                            )}
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3 mt-5 justify-center md:justify-start">
                            {formData.githubUrl && <a href={formData.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><Github className="w-5 h-5 text-gray-700" /></a>}
                            {formData.linkedinUrl && <a href={formData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"><Linkedin className="w-5 h-5 text-blue-600" /></a>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Widget */}
                        <div className="glass-card rounded-xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">About</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{formData.bio || 'No bio provided yet.'}</p>

                            {getFullAddress() && (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Full Address</h3>
                                    <p className="text-gray-600">{getFullAddress()}</p>
                                </div>
                            )}
                        </div>

                        {/* Work Experience Widget */}
                        <div className="glass-card rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-gray-700" />
                                    <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {formData.profile?.workExperience?.length === 0 && (
                                    <p className="text-gray-500 italic text-center py-4">No work experience added.</p>
                                )}

                                {formData.profile?.workExperience?.map((exp, index) => (
                                    <div key={index} className="relative pl-4 border-l-2 border-gray-100">
                                        <h3 className="font-bold text-gray-900 text-lg">{exp.title}</h3>
                                        <p className="text-gray-600 font-medium">{exp.company}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1 mb-3">
                                            <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                                            <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {exp.location}</div>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Job Preferences */}
                        <div className="glass-card rounded-xl p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Job Preferences</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1 mb-1"><Clock className="w-3 h-3" /> Availability</label>
                                    <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                        {formData.profile?.jobPreferences?.availability || 'Unspecified'}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1 mb-1"><DollarSign className="w-3 h-3" /> Expected Salary</label>
                                    <div className="text-gray-900 font-medium">
                                        {formData.profile?.jobPreferences?.expectedSalary || 'Not specified'}
                                    </div>
                                </div>
                                {formData.profile?.jobPreferences?.education && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1 mb-1">Education</label>
                                        <div className="text-gray-900 font-medium">{formData.profile?.jobPreferences?.education}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="glass-card rounded-xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-gray-900">Skills</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(!formData.skills || formData.skills.length === 0) && <span className="text-gray-400 text-sm">No skills added.</span>}
                                {(typeof formData.skills === 'string' ? formData.skills.split(',') : (formData.skills || [])).map((skill: string, i: number) => (
                                    skill.trim() && (
                                        <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                                            {skill.trim()}
                                        </span>
                                    )
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="glass-card rounded-xl p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Stats</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Profile Views</span>
                                    <span className="font-bold text-gray-900">{formData.profile?.profileStats?.views || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Applications Sent</span>
                                    <span className="font-bold text-gray-900">{formData.profile?.profileStats?.applications || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Saved Jobs</span>
                                    <span className="font-bold text-gray-900">{formData.profile?.profileStats?.savedJobs || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // EDIT MODE - New 3-Column Layout
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Left Sidebar: Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
                        <div className="relative inline-block mb-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 mx-auto">
                                {formData.profilePicture ? (
                                    <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <UserIcon className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                                <Camera className="w-4 h-4" />
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">{formData.name}</h2>
                        <p className="text-sm text-gray-500 mb-4">{formData.email}</p>
                    </div>
                </div>

                {/* Center Column: Profile Settings Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">Profile Settings</h2>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600">Name</label>
                                <input
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                    placeholder="First Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600">Surname</label>
                                <input
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                    placeholder="Surname"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600">Headline</label>
                                <input
                                    name="headline"
                                    value={formData.headline}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                    placeholder="Software Engineer | React Specialist"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-600">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender || ''}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-600">Mobile Number</label>
                                    <input
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>

                            {/* Address Section - Compact Grid */}
                            <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-50">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Address Details</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500">Address Line 1</label>
                                        <input
                                            value={formData.profile?.jobPreferences?.addressLine1 || ''}
                                            onChange={(e) => handlePreferenceChange('addressLine1', e.target.value)}
                                            className="w-full p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-purple-500 outline-none transition text-sm"
                                            placeholder="Line 1"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500">Address Line 2</label>
                                        <input
                                            value={formData.profile?.jobPreferences?.addressLine2 || ''}
                                            onChange={(e) => handlePreferenceChange('addressLine2', e.target.value)}
                                            className="w-full p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-purple-500 outline-none transition text-sm"
                                            placeholder="Line 2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500">Area</label>
                                        <input
                                            value={formData.profile?.jobPreferences?.area || ''}
                                            onChange={(e) => handlePreferenceChange('area', e.target.value)}
                                            className="w-full p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-purple-500 outline-none transition text-sm"
                                            placeholder="Area"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500">Postcode</label>
                                        <input
                                            value={formData.profile?.jobPreferences?.postcode || ''}
                                            onChange={(e) => handlePreferenceChange('postcode', e.target.value)}
                                            className="w-full p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-purple-500 outline-none transition text-sm"
                                            placeholder="Postcode"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500">State/Region</label>
                                        <input
                                            value={formData.profile?.jobPreferences?.state || ''}
                                            onChange={(e) => handlePreferenceChange('state', e.target.value)}
                                            className="w-full p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-purple-500 outline-none transition text-sm"
                                            placeholder="State"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500">Country</label>
                                        <input
                                            value={formData.profile?.jobPreferences?.country || ''}
                                            onChange={(e) => handlePreferenceChange('country', e.target.value)}
                                            className="w-full p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-purple-500 outline-none transition text-sm"
                                            placeholder="Country"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600">Education</label>
                                <input
                                    value={formData.profile?.jobPreferences?.education || ''}
                                    onChange={(e) => handlePreferenceChange('education', e.target.value)}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                    placeholder="Education"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600">Skills (comma separated)</label>
                                <textarea
                                    name="skills"
                                    value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition h-24"
                                    placeholder="React, Node.js, TypeScript..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-600">GitHub URL</label>
                                    <input
                                        name="githubUrl"
                                        value={formData.githubUrl}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                        placeholder="https://github.com/..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-600">LinkedIn URL</label>
                                    <input
                                        name="linkedinUrl"
                                        value={formData.linkedinUrl}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="mt-8 text-center">
                            <button
                                onClick={handleSubmit}
                                disabled={isSaving}
                                className="px-8 py-3 bg-[#6C47FF] text-white rounded-lg font-medium shadow-md hover:bg-[#5835cf] transition-all transform hover:-translate-y-0.5"
                            >
                                {isSaving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Experience (Simplified as per image) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-800">Edit Experience</h2>
                            <button onClick={addExperience} className="px-3 py-1 bg-gray-100 text-sm font-medium rounded hover:bg-gray-200">Experience</button>
                        </div>

                        <div className="space-y-6">
                            {formData.profile?.workExperience?.map((exp, index) => (
                                <div key={index} className="space-y-4 p-4 border rounded-lg bg-gray-50 relative">
                                    <button onClick={() => removeExperience(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Experience in Designing</label>
                                        <input
                                            value={exp.title}
                                            onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                                            className="w-full p-2 bg-white border border-gray-200 rounded focus:border-purple-500 outline-none text-sm"
                                            placeholder="Experience"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Additional Details</label>
                                        <input
                                            value={exp.description}
                                            onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                            className="w-full p-2 bg-white border border-gray-200 rounded focus:border-purple-500 outline-none text-sm"
                                            placeholder="Additional details"
                                        />
                                    </div>
                                </div>
                            ))}
                            {formData.profile?.workExperience?.length === 0 && (
                                <p className="text-gray-400 text-sm text-center">No experience added.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
