import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Clock, DollarSign, Briefcase, Eye, X, Users, Calendar, GraduationCap, Building } from 'lucide-react';
import type { Job } from '../../admin/jobs/components/mockData';
import { db } from '../../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Types for modal states
type ModalType = 'create' | 'view' | 'edit' | 'delete' | null;

interface JobFormData {
  title: string;
  position: string;
  company: string;
  location: string;
  type: Job['type'];
  status: Job['status'];
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  experienceLevel: string;
  workingHours: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  skills: string[];
  department: string;
  education: string;
  applicationDeadline: string;
}

// Modal Components (moved outside to prevent recreation)
interface ModalProps {
  selectedJob: Job | null;
  formData: JobFormData;
  currentModal: ModalType;
  closeModal: () => void;
  handleCreateJob: () => void;
  handleUpdateJob: () => void;
  handleDeleteJob: () => void;
  updateFormField: (field: keyof JobFormData, value: any) => void;
  updateArrayField: (field: keyof JobFormData, index: number, value: string) => void;
  addArrayItem: (field: keyof JobFormData) => void;
  removeArrayItem: (field: keyof JobFormData, index: number) => void;
  formatSalary: (job: Job) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
}

function ViewJobModal({ selectedJob, closeModal, formatSalary, formatDate, getStatusColor }: Pick<ModalProps, 'selectedJob' | 'closeModal' | 'formatSalary' | 'formatDate' | 'getStatusColor'>) {
    if (!selectedJob) return null;
    
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                        <p className="text-gray-700">{selectedJob.description}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {selectedJob.requirements.map((req, idx) => (
                                <li key={idx} className="text-gray-700">{req}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {selectedJob.responsibilities.map((resp, idx) => (
                                <li key={idx} className="text-gray-700">{resp}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {selectedJob.benefits.map((benefit, idx) => (
                                <li key={idx} className="text-gray-700">{benefit}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">Skills Required</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedJob.skills.map((skill, idx) => (
                                <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Job Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center">
                                <Building className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{selectedJob.company}</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{selectedJob.location}</span>
                            </div>
                            <div className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{selectedJob.type}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{selectedJob.workingHours}</span>
                            </div>
                            <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{formatSalary(selectedJob)}</span>
                            </div>
                            <div className="flex items-center">
                                <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{selectedJob.education}</span>
                            </div>
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{selectedJob.applicationsCount} applications</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                <span>Deadline: {new Date(selectedJob.applicationDeadline).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Status</h3>
                        <div className="space-y-2">
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedJob.status)}`}>
                                {selectedJob.status}
                            </span>
                            <p className="text-sm text-gray-600">
                                Posted {formatDate(selectedJob.postedDate)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const JobsPage = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter] = useState<string>('All');
    const [typeFilter, setTypeFilter] = useState<string>('All');
    const [departmentFilter] = useState<string>('All');
    
    // Modal states
    const [currentModal, setCurrentModal] = useState<ModalType>(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const jobsRef = collection(db, 'jobs');
                const q = query(jobsRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                
                const jobsData: Job[] = [];
                
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const job: Job = {
                        id: doc.id,
                        ...data
                    } as Job;
                    jobsData.push(job);
                });
                
                setJobs(jobsData);
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Failed to load jobs. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Color utilities
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Full-time': return 'bg-green-100 text-green-800';
            case 'Part-time': return 'bg-yellow-100 text-yellow-800';
            case 'Contract': return 'bg-orange-100 text-orange-800';
            case 'Remote': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Draft': return 'bg-yellow-100 text-yellow-800';
            case 'Closed': return 'bg-red-100 text-red-800';
            case 'Paused': return 'bg-gray-100 text-gray-800';
            case 'Archived': return 'bg-slate-100 text-slate-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCompanyIconColor = (index: number) => {
        const colors = ['bg-blue-500', 'bg-orange-500', 'bg-pink-500', 'bg-green-500', 'bg-purple-500'];
        return colors[index % colors.length];
    };

    // Filtering logic
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
            const matchesType = typeFilter === 'All' || job.type === typeFilter;
            const matchesDepartment = departmentFilter === 'All' || job.department === departmentFilter;
            
            return matchesSearch && matchesStatus && matchesType && matchesDepartment;
        });
    }, [jobs, searchTerm, statusFilter, typeFilter, departmentFilter]);

    // Utility functions
    const formatSalary = (job: Job) => {
        if (job.currency === 'GBP/day') {
            return `£${job.salaryMin} - £${job.salaryMax}/day`;
        }
        return `£${job.salaryMin.toLocaleString()} - £${job.salaryMax.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    // Modal handlers
    const openViewModal = (type: ModalType, job?: Job) => {
        setCurrentModal(type);
        setSelectedJob(job || null);
    };

    const closeModal = () => {
        setCurrentModal(null);
        setSelectedJob(null);
    };

    // Loading state
    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading jobs...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Search and Filters */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by title, company, skills, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex space-x-4 mb-6">
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="All">All Types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>

                    {/* Job Listings */}
                    <div className="space-y-4">
                        {filteredJobs.map((job, index) => (
                            <div key={job.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4 flex-1">
                                            {/* Company Icon */}
                                            <div className={`w-16 h-16 ${getCompanyIconColor(index)} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                                                {job.company.charAt(0)}
                                            </div>
                                            
                                            {/* Job Details */}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex flex-row items-center">
                                                        <h3 className="text-xl font-semibold text-gray-900">{job.title}, </h3>
                                                        <h3 className="text-xl font-semibold text-blue-600 ml-2">{job.company}</h3>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button 
                                                            onClick={() => openViewModal('view', job)}
                                                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            View
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-gray-400 text-sm mb-2">{job.position}</p>
                                                
                                                <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                                                
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                                    <div className="flex items-center">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {job.location}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Briefcase className="w-4 h-4 mr-1" />
                                                        {job.experienceLevel}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        {job.workingHours}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <DollarSign className="w-4 h-4 mr-1" />
                                                        {formatSalary(job)}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Users className="w-4 h-4 mr-1" />
                                                        {job.applicationsCount} applications
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                                                            {job.status}
                                                        </span>
                                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(job.type)}`}>
                                                            {job.type}
                                                        </span>
                                                        <span className="text-sm text-gray-500">{formatDate(job.postedDate)}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {job.skills.slice(0, 3).map((skill, idx) => (
                                                            <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {job.skills.length > 3 && (
                                                            <span className="text-xs text-gray-500">+{job.skills.length - 3} more</span>
                                                        )}
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
                    {filteredJobs.length === 0 && (
                        <div className="text-center py-12">
                            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                        </div>
                    )}

                    {/* Results count */}
                    <div className="mt-4 text-sm text-gray-500">
                        Showing {filteredJobs.length} of {jobs.length} job listings
                    </div>
                </div>
            </div>

            {/* Modals */}
            {currentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto animate-slideUp">
                        {currentModal === 'view' && selectedJob && (
                            <ViewJobModal 
                                selectedJob={selectedJob}
                                closeModal={closeModal}
                                formatSalary={formatSalary}
                                formatDate={formatDate}
                                getStatusColor={getStatusColor}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default JobsPage;