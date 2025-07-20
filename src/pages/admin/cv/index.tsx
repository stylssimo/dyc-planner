import { useState } from 'react';
import { Search, Filter, MoreHorizontal, Star, StarOff, User, Phone, Mail, Calendar, GraduationCap, Briefcase, Globe, Users } from 'lucide-react';

interface Applicant {
    id: string;
    appliedJob: string;
    familyName: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
    gender: 'Male' | 'Female' | 'Other';
    phoneNumber: string;
    languageProficiency: string[];
    email: string;
    workExperience: string;
    education: string;
    major: string;
    desiredJob: string;
    isStarred: boolean;
    profilePicture?: string;
    appliedDate: string;
    status: 'New' | 'Reviewed' | 'Interviewed' | 'Hired' | 'Rejected';
}

const AdminCV = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedJob, setSelectedJob] = useState('All');
    const [showStarredOnly, setShowStarredOnly] = useState(false);

    // Mock applicants data
    const [applicants, setApplicants] = useState<Applicant[]>([
        {
            id: '1',
            appliedJob: 'Database Programmer',
            familyName: 'Johnson',
            firstName: 'Michael',
            lastName: 'Johnson',
            birthDate: '1990-03-15',
            maritalStatus: 'Single',
            gender: 'Male',
            phoneNumber: '+44 7123 456789',
            languageProficiency: ['English (Native)', 'Spanish (Intermediate)', 'French (Basic)'],
            email: 'michael.johnson@email.com',
            workExperience: '5 years in database development and optimization',
            education: 'Bachelor of Computer Science',
            major: 'Computer Science',
            desiredJob: 'Senior Database Developer',
            isStarred: true,
            profilePicture: '/api/placeholder/80/80',
            appliedDate: '2024-01-15',
            status: 'Reviewed'
        },
        {
            id: '2',
            appliedJob: 'PHP Programmer',
            familyName: 'Smith',
            firstName: 'Sarah',
            lastName: 'Smith',
            birthDate: '1988-07-22',
            maritalStatus: 'Married',
            gender: 'Female',
            phoneNumber: '+44 7234 567890',
            languageProficiency: ['English (Native)', 'German (Advanced)'],
            email: 'sarah.smith@email.com',
            workExperience: '7 years in full-stack PHP development',
            education: 'Master of Software Engineering',
            major: 'Software Engineering',
            desiredJob: 'Lead PHP Developer',
            isStarred: false,
            profilePicture: '/api/placeholder/80/80',
            appliedDate: '2024-01-12',
            status: 'New'
        },
        {
            id: '3',
            appliedJob: 'Frontend Developer',
            familyName: 'Wilson',
            firstName: 'David',
            lastName: 'Wilson',
            birthDate: '1992-11-08',
            maritalStatus: 'Single',
            gender: 'Male',
            phoneNumber: '+44 7345 678901',
            languageProficiency: ['English (Native)', 'Italian (Intermediate)'],
            email: 'david.wilson@email.com',
            workExperience: '3 years in React and Vue.js development',
            education: 'Bachelor of Information Technology',
            major: 'Information Technology',
            desiredJob: 'Frontend Developer',
            isStarred: true,
            profilePicture: '/api/placeholder/80/80',
            appliedDate: '2024-01-10',
            status: 'Interviewed'
        },
        {
            id: '4',
            appliedJob: 'DevOps Engineer',
            familyName: 'Brown',
            firstName: 'Emma',
            lastName: 'Brown',
            birthDate: '1985-05-12',
            maritalStatus: 'Married',
            gender: 'Female',
            phoneNumber: '+44 7456 789012',
            languageProficiency: ['English (Native)', 'Japanese (Basic)'],
            email: 'emma.brown@email.com',
            workExperience: '8 years in cloud infrastructure and automation',
            education: 'Master of Computer Engineering',
            major: 'Computer Engineering',
            desiredJob: 'Senior DevOps Engineer',
            isStarred: false,
            profilePicture: '/api/placeholder/80/80',
            appliedDate: '2024-01-08',
            status: 'Hired'
        },
        {
            id: '5',
            appliedJob: 'Intern Programmer',
            familyName: 'Taylor',
            firstName: 'James',
            lastName: 'Taylor',
            birthDate: '1999-09-25',
            maritalStatus: 'Single',
            gender: 'Male',
            phoneNumber: '+44 7567 890123',
            languageProficiency: ['English (Native)', 'Mandarin (Intermediate)'],
            email: 'james.taylor@email.com',
            workExperience: '1 year internship experience',
            education: 'Bachelor of Computer Science (In Progress)',
            major: 'Computer Science',
            desiredJob: 'Junior Software Developer',
            isStarred: false,
            profilePicture: '/api/placeholder/80/80',
            appliedDate: '2024-01-05',
            status: 'Rejected'
        }
    ])

    const jobTitles = [...new Set(applicants.map(app => app.appliedJob))];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New':
                return 'bg-blue-100 text-blue-800';
            case 'Reviewed':
                return 'bg-yellow-100 text-yellow-800';
            case 'Interviewed':
                return 'bg-purple-100 text-purple-800';
            case 'Hired':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getProfileInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const toggleStar = (applicantId: string) => {
        setApplicants(prev => prev.map(app => 
            app.id === applicantId ? { ...app, isStarred: !app.isStarred } : app
        ));
    };

    const filteredApplicants = applicants.filter(applicant => {
        const matchesSearch = applicant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            applicant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            applicant.appliedJob.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'All' || applicant.status === selectedStatus;
        const matchesJob = selectedJob === 'All' || applicant.appliedJob === selectedJob;
        const matchesStarred = !showStarredOnly || applicant.isStarred;
        
        return matchesSearch && matchesStatus && matchesJob && matchesStarred;
    });

    const handleViewProfile = (applicantId: string) => {
        window.open(`/admin/cv/view/${applicantId}`, '_blank');
    };

    const handleUpdateStatus = (applicantId: string, newStatus: string) => {
        setApplicants(prev => prev.map(app => 
            app.id === applicantId ? { ...app, status: newStatus as Applicant['status'] } : app
        ));
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">CV Applicants</h1>
                        <p className="text-gray-600 mt-1">
                            Showing {filteredApplicants.length} Applicant Results
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {applicants.filter(app => app.isStarred).length}
                            </div>
                            <div className="text-gray-500 text-sm">Starred</div>
                        </div>
                        <div className="h-12 w-px bg-gray-300"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {applicants.filter(app => app.status === 'New').length}
                            </div>
                            <div className="text-gray-500 text-sm">New</div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Name, Email, or Job Title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <select 
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">All Status</option>
                                <option value="New">New</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Interviewed">Interviewed</option>
                                <option value="Hired">Hired</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            
                            <select 
                                value={selectedJob}
                                onChange={(e) => setSelectedJob(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">All Jobs</option>
                                {jobTitles.map(job => (
                                    <option key={job} value={job}>{job}</option>
                                ))}
                            </select>
                            
                            <button 
                                onClick={() => setShowStarredOnly(!showStarredOnly)}
                                className={`p-2 border rounded-lg transition-colors ${
                                    showStarredOnly 
                                        ? 'bg-yellow-100 border-yellow-300 text-yellow-800' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <Star className="w-4 h-4" />
                            </button>
                            
                            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                <Filter className="w-4 h-4" />
                            </button>
                            
                            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status Filter Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-sm text-gray-600 mr-2">Filter by status:</span>
                    {['All', 'New', 'Reviewed', 'Interviewed', 'Hired', 'Rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                selectedStatus === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Applicants List */}
                <div className="space-y-4">
                    {filteredApplicants.map((applicant) => (
                        <div key={applicant.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        {/* Profile Picture */}
                                        <div className="relative">
                                            {applicant.profilePicture ? (
                                                <img 
                                                    src={applicant.profilePicture} 
                                                    alt={`${applicant.firstName} ${applicant.lastName}`}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {getProfileInitials(applicant.firstName, applicant.lastName)}
                                                </div>
                                            )}
                                            <button 
                                                onClick={() => toggleStar(applicant.id)}
                                                className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                                            >
                                                {applicant.isStarred ? (
                                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                ) : (
                                                    <StarOff className="w-4 h-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                        
                                        {/* Applicant Details */}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {applicant.firstName} {applicant.lastName}
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    <select 
                                                        value={applicant.status}
                                                        onChange={(e) => handleUpdateStatus(applicant.id, e.target.value)}
                                                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="New">New</option>
                                                        <option value="Reviewed">Reviewed</option>
                                                        <option value="Interviewed">Interviewed</option>
                                                        <option value="Hired">Hired</option>
                                                        <option value="Rejected">Rejected</option>
                                                    </select>
                                                    <button 
                                                        onClick={() => handleViewProfile(applicant.id)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        View Profile
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <p className="text-gray-600 mb-2">Applied for: <span className="font-medium">{applicant.appliedJob}</span></p>
                                            <p className="text-sm text-gray-500 mb-3">Desired Position: {applicant.desiredJob}</p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center">
                                                    <Mail className="w-4 h-4 mr-2" />
                                                    {applicant.email}
                                                </div>
                                                <div className="flex items-center">
                                                    <Phone className="w-4 h-4 mr-2" />
                                                    {applicant.phoneNumber}
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    {calculateAge(applicant.birthDate)} years old
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 mr-2" />
                                                    {applicant.maritalStatus} • {applicant.gender}
                                                </div>
                                                <div className="flex items-center">
                                                    <GraduationCap className="w-4 h-4 mr-2" />
                                                    {applicant.education}
                                                </div>
                                                <div className="flex items-center">
                                                    <Briefcase className="w-4 h-4 mr-2" />
                                                    {applicant.workExperience}
                                                </div>
                                            </div>
                                            
                                            <div className="mb-4">
                                                <div className="flex items-center mb-2">
                                                    <Globe className="w-4 h-4 mr-2 text-gray-600" />
                                                    <span className="text-sm text-gray-600">Languages:</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {applicant.languageProficiency.map((lang, index) => (
                                                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                            {lang}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(applicant.status)}`}>
                                                        {applicant.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        Applied: {new Date(applicant.appliedDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                                                        Download CV
                                                    </button>
                                                    <button className="text-green-600 hover:text-green-800 text-sm">
                                                        Schedule Interview
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredApplicants.length === 0 && (
                    <div className="text-center py-12">
                        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCV;