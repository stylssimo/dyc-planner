import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Edit, Save, X, Shield, Bell, Globe, Calendar } from 'lucide-react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../../contexts/AuthContext';

interface PersonalInfo {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
    nationality: string;
    bio: string;
    profilePicture?: string;
}

interface Preferences {
    language: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
}

interface Social {
    linkedin: string;
    github: string;
    website: string;
    twitter: string;
}

interface ProfileData {
    personalInfo: PersonalInfo;
    preferences: Preferences;
    social: Social;
    lastUpdated: string;
}

const UserProfile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');

    useEffect(() => {
        const fetchProfileData = async () => {
			console.log(user?.email, user)
            if (!user?.email) return;

            try {
                setLoading(true);
                // Replace with your actual database call
				const docRef = doc(db, 'users', user.email);
                const docSnap = await getDoc(docRef);

				console.log(docSnap.data());

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.profile) {
						console.log(userData.profile);

						const profileData = userData.profile;
						setProfileData({
							personalInfo: {
								fullName: profileData.personalInfo.fullName as string,
								email: profileData.personalInfo.email as string,
								phoneNumber: profileData.personalInfo.phoneNumber as string,
								address: profileData.personalInfo.address as string,
								dateOfBirth: profileData.personalInfo.dateOfBirth as string,
								nationality: profileData.personalInfo.nationality as string,
								bio: profileData.personalInfo.bio as string,
								profilePicture: profileData.personalInfo.profilePicture || undefined
							},
							preferences: profileData.preferences as Preferences,
							social: profileData.social as Social,
							lastUpdated: profileData.lastUpdated as string
						});
                    } else {
                        // Initialize empty profile
                        const emptyProfile: ProfileData = {
                            personalInfo: {
                                fullName: user.name || '',
                                email: user.email || '',
                                phoneNumber: '',
                                address: '',
                                dateOfBirth: '',
                                nationality: '',
                                bio: '',
                                profilePicture: user.picture || undefined
                            },
                            preferences: {
								language: 'English',
                                emailNotifications: true,
                                pushNotifications: false,
                            },
                            social: {
                                linkedin: '',
                                github: '',
                                website: '',
                                twitter: ''
                            },
                            lastUpdated: new Date().toISOString()
                        };
                        setProfileData(emptyProfile);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleSave = async () => {
        if (!user?.email || !profileData) return;

        try {
            setSaving(true);
            
            const updatedProfile = {
                ...profileData,
                lastUpdated: new Date().toISOString()
            };

            // Replace with your actual database call

			await updateDoc(doc(db, 'users', user.email), {
				profile: updatedProfile
			});

            setProfileData(updatedProfile);
            setEditing(false);
            alert('Profile saved successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
        if (!profileData) return;
        setProfileData({
            ...profileData,
            personalInfo: { ...profileData.personalInfo, [field]: value }
        });
    };

    const updatePreferences = (field: keyof Preferences, value: string | boolean) => {
        if (!profileData) return;
        setProfileData({
            ...profileData,
            preferences: { ...profileData.preferences, [field]: value }
        });
    };

    const updateSocial = (field: keyof Social, value: string) => {
        if (!profileData) return;
        setProfileData({
            ...profileData,
            social: { ...profileData.social, [field]: value }
        });
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
                <div className="text-center">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h2>
                    <p className="text-gray-600">You need to be logged in to view your profile.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
                <div className="text-center">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile not found</h2>
                    <p className="text-gray-600">Unable to load your profile data.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    {profileData.personalInfo.fullName?.charAt(0) || user.name?.charAt(0) || 'U'}
                                </div>
                                {editing && (
                                    <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition-colors">
                                        <Camera className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                                <p className="text-gray-600">
                                    Last updated: {new Date(profileData.lastUpdated).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {editing ? (
                                <>
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Cancel</span>
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{saving ? 'Saving...' : 'Save'}</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit Profile</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'personal'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <User className="w-4 h-4 inline mr-2" />
                                Personal Info
                            </button>
                            <button
                                onClick={() => setActiveTab('preferences')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'preferences'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Shield className="w-4 h-4 inline mr-2" />
                                Preferences
                            </button>
                            <button
                                onClick={() => setActiveTab('social')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'social'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Globe className="w-4 h-4 inline mr-2" />
                                Social Links
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={profileData.personalInfo.fullName}
                                        onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900">{profileData.personalInfo.fullName || 'Not provided'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <p className="text-gray-900 flex items-center">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {profileData.personalInfo.email}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={profileData.personalInfo.phoneNumber}
                                        onChange={(e) => updatePersonalInfo('phoneNumber', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900 flex items-center">
                                        <Phone className="w-4 h-4 mr-2" />
                                        {profileData.personalInfo.phoneNumber || 'Not provided'}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                {editing ? (
                                    <input
                                        type="date"
                                        value={profileData.personalInfo.dateOfBirth}
                                        onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {profileData.personalInfo.dateOfBirth ? 
                                            new Date(profileData.personalInfo.dateOfBirth).toLocaleDateString() : 
                                            'Not provided'
                                        }
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={profileData.personalInfo.nationality}
                                        onChange={(e) => updatePersonalInfo('nationality', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900">{profileData.personalInfo.nationality || 'Not provided'}</p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={profileData.personalInfo.address}
                                        onChange={(e) => updatePersonalInfo('address', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900 flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {profileData.personalInfo.address || 'Not provided'}
                                    </p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                {editing ? (
                                    <textarea
                                        value={profileData.personalInfo.bio}
                                        onChange={(e) => updatePersonalInfo('bio', e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-gray-900">{profileData.personalInfo.bio || 'Not provided'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Shield className="w-5 h-5 mr-2" />
                            Preferences & Privacy
                        </h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                    {editing ? (
                                        <select
                                            value={profileData.preferences.language}
                                            onChange={(e) => updatePreferences('language', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="English">English</option>
                                            <option value="Spanish">Mongolian</option>
                                        </select>
                                    ) : (
                                        <p className="text-gray-900">{profileData.preferences.language}</p>
                                    )}
                                </div>
                            </div>
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <Bell className="w-5 h-5 mr-2" />
                                    Notifications
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                                        </div>
                                        {editing ? (
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={profileData.preferences.emailNotifications}
                                                    onChange={(e) => updatePreferences('emailNotifications', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        ) : (
                                            <span className={`text-sm ${profileData.preferences.emailNotifications ? 'text-green-600' : 'text-gray-500'}`}>
                                                {profileData.preferences.emailNotifications ? 'Enabled' : 'Disabled'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Push Notifications</label>
                                            <p className="text-sm text-gray-500">Receive push notifications</p>
                                        </div>
                                        {editing ? (
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={profileData.preferences.pushNotifications}
                                                    onChange={(e) => updatePreferences('pushNotifications', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        ) : (
                                            <span className={`text-sm ${profileData.preferences.pushNotifications ? 'text-green-600' : 'text-gray-500'}`}>
                                                {profileData.preferences.pushNotifications ? 'Enabled' : 'Disabled'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Social Links Tab */}
                {activeTab === 'social' && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Globe className="w-5 h-5 mr-2" />
                            Social Links
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                                {editing ? (
                                    <input
                                        type="url"
                                        value={profileData.social.linkedin}
                                        onChange={(e) => updateSocial('linkedin', e.target.value)}
                                        placeholder="https://linkedin.com/in/yourprofile"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900">
                                        {profileData.social.linkedin ? (
                                            <a href={profileData.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {profileData.social.linkedin}
                                            </a>
                                        ) : (
                                            'Not provided'
                                        )}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                                {editing ? (
                                    <input
                                        type="url"
                                        value={profileData.social.github}
                                        onChange={(e) => updateSocial('github', e.target.value)}
                                        placeholder="https://github.com/yourusername"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900">
                                        {profileData.social.github ? (
                                            <a href={profileData.social.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {profileData.social.github}
                                            </a>
                                        ) : (
                                            'Not provided'
                                        )}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                {editing ? (
                                    <input
                                        type="url"
                                        value={profileData.social.website}
                                        onChange={(e) => updateSocial('website', e.target.value)}
                                        placeholder="https://yourwebsite.com"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900">
                                        {profileData.social.website ? (
                                            <a href={profileData.social.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {profileData.social.website}
                                            </a>
                                        ) : (
                                            'Not provided'
                                        )}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                                {editing ? (
                                    <input
                                        type="url"
                                        value={profileData.social.twitter}
                                        onChange={(e) => updateSocial('twitter', e.target.value)}
                                        placeholder="https://twitter.com/yourusername"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900">
                                        {profileData.social.twitter ? (
                                            <a href={profileData.social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {profileData.social.twitter}
                                            </a>
                                        ) : (
                                            'Not provided'
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;