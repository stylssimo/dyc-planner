import { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Star, StarOff, User, Phone, Mail, Calendar, GraduationCap, Briefcase, Globe, Users } from 'lucide-react';
import { db } from '../../../firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';

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
    status: 'New' | 'Reviewed' | 'Interviewed' | 'Hired' | 'Rejected' | 'Interview Scheduled';
    appliedJobId: string;
}

const InterviewModal = ({ applicant, onClose, selectedJob, triggerRefresh }: { applicant: Applicant; onClose: () => void, selectedJob: string, triggerRefresh: () => void }) => {

    const { user } = useAuth();

    const generateAvailableDates = () => {
        const dates = [];
        const today = new Date();
        
        for (let i = 1; i <= 45; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            // Skip weekends
            if (date.getDay() !== 0 && date.getDay() !== 6) {
                dates.push(date.toISOString().split('T')[0]);
            }
        }
        
        return dates;
    };
    
      // Generate available time slots
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    const availableDates = generateAvailableDates();

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [notes] = useState('');
    const [isSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const interviewData = {
            date: selectedDate,
            time: selectedTime,
            applicantEmail: applicant.email,
            applicantName: `${applicant.firstName} ${applicant.lastName}`,
        }

        try {
            const userRef = doc(db, 'users', applicant.email, 'jobApplications', applicant.appliedJobId);
            await updateDoc(userRef, {
                status: 'Interview Scheduled',
                interviewDate: selectedDate,
                interviewTime: selectedTime,
                interviewer: user?.name || '',
                interviewerEmail: user?.email || '',
                interviewerName: user?.name || '',
            });
            console.log('User status updated successfully');
            const cvRef = doc(db, 'cv', applicant.id);
            console.log(applicant.id)
            await updateDoc(cvRef, {
                status: 'Interview Scheduled',
                interviewDate: selectedDate,
                interviewTime: selectedTime,
                interviewer: user?.name || '',
            });
            onClose();
            triggerRefresh();
            console.log('CV status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
        }

        console.log('Form submitted', interviewData);
    };

    const formatDateForDisplay = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Interview with {applicant.firstName} {applicant.lastName} for {selectedJob}</h2>
                <div className="flex flex-col gap-4">
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Date Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date
                        </label>
                        <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        >
                        <option value="">Select a date</option>
                        {availableDates.map(date => (
                            <option key={date} value={date}>
                            {formatDateForDisplay(date)}
                            </option>
                        ))}
                        </select>
                    </div>

                    {/* Time Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time
                        </label>
                        <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={!selectedDate}
                        >
                        <option value="">Select a time</option>
                        {timeSlots.map(time => (
                            <option key={time} value={time}>
                            {time}
                            </option>
                        ))}
                        </select>
                        {!selectedDate && (
                        <p className="text-xs text-gray-500 mt-1">Please select a date first</p>
                        )}
                    </div>

                    {/* Summary */}
                    {selectedDate && selectedTime && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Interview Summary:</h4>
                        <div className="text-sm text-blue-800">
                            <p><strong>Applicant:</strong> {applicant.firstName} {applicant.lastName}</p>
                            <p><strong>Date:</strong> {formatDateForDisplay(selectedDate)}</p>
                            <p><strong>Time:</strong> {selectedTime}</p>
                            {notes && <p><strong>Notes:</strong> {notes}</p>}
                        </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !selectedDate || !selectedTime}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                        {isSubmitting ? 'Scheduling...' : 'Schedule Interview'}
                        </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
};

const AdminCV = () => {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedJob, setSelectedJob] = useState('All');
    const [showStarredOnly, setShowStarredOnly] = useState(false);

    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

    const [applicantJobId, setApplicantJobId] = useState('');

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const cvRef = collection(db, 'cv');
            const q = query(cvRef, orderBy('appliedAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            const applicantsData: Applicant[] = [];
            querySnapshot.forEach((doc) => {
                const cvApplication = doc.data();
                const cvData = cvApplication.applicantCV;
                
                // Map Firebase data to Applicant interface
                applicantsData.push({
                    id: doc.id, // Use CV application document ID
                    appliedJob: cvApplication.jobTitle || 'Not specified',
                    familyName: cvData?.personalInfo?.fullName?.split(' ')[1] || cvApplication.applicantName?.split(' ')[1] || '',
                    firstName: cvData?.personalInfo?.fullName?.split(' ')[0] || cvApplication.applicantName?.split(' ')[0] || '',
                    lastName: cvData?.personalInfo?.fullName?.split(' ')[1] || cvApplication.applicantName?.split(' ')[1] || '',
                    birthDate: cvData?.personalInfo?.birthDate || '1990-01-01',
                    maritalStatus: cvData?.personalInfo?.maritalStatus || 'Single',
                    gender: cvData?.personalInfo?.gender || 'Other',
                    phoneNumber: cvData?.personalInfo?.phone || 'Not provided',
                    languageProficiency: cvData?.languages?.map((lang: any) => 
                        `${lang.language} (${lang.proficiency})`
                    ) || [],
                    email: cvApplication.applicantEmail || cvData?.personalInfo?.email || '',
                    workExperience: cvData?.workExperience?.[0]?.achievements?.[0] || cvData?.workExperience?.[0]?.company || 'No experience listed',
                    education: cvData?.education?.[0]?.degree || cvData?.education?.[0]?.institution || 'Not specified',
                    major: cvData?.education?.[0]?.degree?.includes('Computer') ? 'Computer Science' : 'Other',
                    desiredJob: cvData?.personalInfo?.professionalTitle || 'Looking for opportunities',
                    isStarred: cvApplication.isStarred || false, // From CV collection
                    profilePicture: cvData?.personalInfo?.photo || null,
                    appliedDate: cvApplication.appliedAt || new Date().toISOString(),
                    status: cvApplication.status || 'New',
                    appliedJobId: cvApplication.jobId || '',
                });
            });
            
            setApplicants(applicantsData);
        } catch (error) {
            console.error('Error fetching CV applications:', error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchApplicants();
    }, []);
    

    const handleUpdateStatus = async (applicantId: string, newStatus: string) => {
        try {
            const cvRef = doc(db, 'cv', applicantId);
            
            // Update the CV application status
            await updateDoc(cvRef, {
                status: newStatus,
                reviewedAt: new Date().toISOString()
            });
            
            // Update local state
            setApplicants(prev => prev.map(app => 
                app.id === applicantId ? { ...app, status: newStatus as Applicant['status'] } : app
            ));
            
            console.log('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };
    
    const toggleStar = async (applicantId: string) => {
        try {
            const applicant = applicants.find(app => app.id === applicantId);
            if (!applicant) return;
            
            const cvRef = doc(db, 'cv', applicantId);
            const newStarredStatus = !applicant.isStarred;
            
            await updateDoc(cvRef, {
                isStarred: newStarredStatus,
                reviewedAt: new Date().toISOString()
            });
            
            // Update local state
            setApplicants(prev => prev.map(app => 
                app.id === applicantId ? { ...app, isStarred: newStarredStatus } : app
            ));
            
            console.log('Star status updated successfully');
        } catch (error) {
            console.error('Error updating star status:', error);
        }
    };
    

    
    // const handleViewProfile = (applicantId: string) => {
    //     // Navigate to the detailed CV view page
    //     window.open(`/admin/cv/view/${applicantId}`, '_blank');
    // };

    const handleScheduleInterview = (applicantId: string, jobId: string) => {
        setSelectedApplicant(applicants.find(app => app.id === applicantId) || null);
        setApplicantJobId(jobId);
        setShowInterviewModal(true);
    };


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

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
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
                                                        {/* <button 
                                                            onClick={() => handleViewProfile(applicant.id)}
                                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                                        >
                                                            View Profile
                                                        </button> */}
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
                                                        {
                                                            applicant?.status === 'Interview Scheduled' ? (
                                                                <button className="text-green-600 hover:text-green-800 text-sm">
                                                                    Interview Scheduled
                                                                </button>
                                                            ) : (
                                                                <button
                                                                className="text-green-600 hover:text-green-800 text-sm"
                                                                onClick={() => handleScheduleInterview(applicant.id, applicant.appliedJobId)}
                                                            >
                                                                Schedule Interview
                                                            </button>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredApplicants.length === 0 && (
                    <div className="text-center py-12">
                        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
            {showInterviewModal && selectedApplicant && (
                <InterviewModal
                    applicant={selectedApplicant}
                    onClose={() => setShowInterviewModal(false)}
                    selectedJob={applicantJobId}
                    triggerRefresh={fetchApplicants}
                />
            )}
        </div>
    );
};

export default AdminCV;