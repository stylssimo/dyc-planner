import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, MapPin, Clock, DollarSign, Filter, MoreHorizontal, Briefcase, Eye, Edit, Trash2, X, Users, Calendar, GraduationCap, Building, Archive } from 'lucide-react';
import { type Job } from './components/mockData';
import { db } from '../../../firebase';
import { collection, getDocs, query, orderBy, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';

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

function CreateEditJobModal({ 
    currentModal, 
    formData, 
    closeModal, 
    handleCreateJob, 
    handleUpdateJob, 
    updateFormField, 
    updateArrayField, 
    addArrayItem, 
    removeArrayItem 
}: Pick<ModalProps, 'currentModal' | 'formData' | 'closeModal' | 'handleCreateJob' | 'handleUpdateJob' | 'updateFormField' | 'updateArrayField' | 'addArrayItem' | 'removeArrayItem'>) {
    const isEditing = currentModal === 'edit';
    
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Edit Job Listing' : 'Create Job Listing'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); isEditing ? handleUpdateJob() : handleCreateJob(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => updateFormField('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        <input
                            type="text"
                            value={formData.position}
                            onChange={(e) => updateFormField('position', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => updateFormField('company', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => updateFormField('location', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => updateFormField('type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => updateFormField('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                            <option value="Paused">Paused</option>
                            <option value="Closed">Closed</option>
                            <option value="Archived">Archived</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input
                            type="text"
                            value={formData.department}
                            onChange={(e) => updateFormField('department', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                        <input
                            type="text"
                            value={formData.experienceLevel}
                            onChange={(e) => updateFormField('experienceLevel', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 3-5 years"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
                        <input
                            type="text"
                            value={formData.workingHours}
                            onChange={(e) => updateFormField('workingHours', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 40 hours/week"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                        <input
                            type="date"
                            value={formData.applicationDeadline}
                            onChange={(e) => updateFormField('applicationDeadline', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary Min</label>
                        <input
                            type="number"
                            value={formData.salaryMin}
                            onChange={(e) => updateFormField('salaryMin', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary Max</label>
                        <input
                            type="number"
                            value={formData.salaryMax}
                            onChange={(e) => updateFormField('salaryMax', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                        <select
                            value={formData.currency}
                            onChange={(e) => updateFormField('currency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="GBP">GBP</option>
                            <option value="GBP/day">GBP/day</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => updateFormField('description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Education Requirements</label>
                    <input
                        type="text"
                        value={formData.education}
                        onChange={(e) => updateFormField('education', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Bachelor's degree in Computer Science"
                        required
                    />
                </div>

                {/* Dynamic array fields */}
                {['requirements', 'responsibilities', 'benefits', 'skills'].map((field) => (
                    <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                        <div className="space-y-2">
                            {(formData[field as keyof JobFormData] as string[]).map((item, index) => (
                                <div key={index} className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateArrayField(field as keyof JobFormData, index, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={`Enter ${field.slice(0, -1)}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(field as keyof JobFormData, index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem(field as keyof JobFormData)}
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add {field.slice(0, -1)}
                            </button>
                        </div>
                    </div>
                ))}

                <div className="flex space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {isEditing ? 'Update Job' : 'Create Job'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function DeleteJobModal({ selectedJob, closeModal, handleDeleteJob }: Pick<ModalProps, 'selectedJob' | 'closeModal' | 'handleDeleteJob'>) {
    if (!selectedJob) return null;
    
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Delete Job Listing</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="mb-6">
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Are you sure?</h3>
                        <p className="text-gray-600">This action cannot be undone.</p>
                    </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{selectedJob.title}</h4>
                    <p className="text-sm text-gray-600">{selectedJob.company} • {selectedJob.location}</p>
                    <p className="text-sm text-gray-600">{selectedJob.applicationsCount} applications will be affected</p>
                </div>
            </div>

            <div className="flex space-x-3">
                <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDeleteJob}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Delete Job
                </button>
            </div>
        </div>
    );
}

const AdminJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [typeFilter, setTypeFilter] = useState<string>('All');
    const [departmentFilter, setDepartmentFilter] = useState<string>('All');
    
    // Modal states
    const [currentModal, setCurrentModal] = useState<ModalType>(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [formData, setFormData] = useState<JobFormData>({
      title: '',
      position: '',
      company: '',
      location: '',
      type: 'Full-time',
      status: 'Draft',
      description: '',
      requirements: [''],
      responsibilities: [''],
      benefits: [''],
      experienceLevel: '',
      workingHours: '',
      salaryMin: 0,
      salaryMax: 0,
      currency: 'GBP',
      skills: [''],
      department: '',
      education: '',
      applicationDeadline: '',
    });

    // Fetch jobs from Firebase
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

    // Get unique values for filters
    const uniqueDepartments = useMemo(() => {
        const departments = jobs.map(job => job.department);
        return ['All', ...Array.from(new Set(departments))];
    }, [jobs]);

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
    const openModal = (type: ModalType, job?: Job) => {
        setCurrentModal(type);
        setSelectedJob(job || null);
        
        if (type === 'create') {
            setFormData({
                title: '', position: '', company: '', location: '', type: 'Full-time', status: 'Draft',
                description: '', requirements: [''], responsibilities: [''], benefits: [''],
                experienceLevel: '', workingHours: '', salaryMin: 0, salaryMax: 0, currency: 'GBP',
                skills: [''], department: '', education: '', applicationDeadline: '',
            });
        } else if (type === 'edit' && job) {
            setFormData({
                title: job.title, position: job.position, company: job.company, location: job.location,
                type: job.type, status: job.status, description: job.description,
                requirements: job.requirements, responsibilities: job.responsibilities, benefits: job.benefits,
                experienceLevel: job.experienceLevel, workingHours: job.workingHours,
                salaryMin: job.salaryMin, salaryMax: job.salaryMax, currency: job.currency,
                skills: job.skills, department: job.department, education: job.education,
                applicationDeadline: job.applicationDeadline,
            });
        }
    };

    const closeModal = () => {
        setCurrentModal(null);
        setSelectedJob(null);
    };

    // CRUD operations with Firebase
    const handleCreateJob = async () => {
        try {
            const jobId = `job-${nanoid(10)}`;
            const newJob: Job = {
                ...formData,
                id: jobId,
                postedDate: new Date().toISOString().split('T')[0],
                applicationsCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            
            const jobRef = doc(db, 'jobs', jobId);
            await setDoc(jobRef, newJob);
            
            setJobs(prev => [newJob, ...prev]);
            closeModal();
            
            console.log('Job created with ID:', jobId);
        } catch (error) {
            console.error('Error creating job:', error);
            alert('Failed to create job. Please try again.');
        }
    };

    const handleUpdateJob = async () => {
        if (!selectedJob) return;
        
        try {
            const updatedJob: Job = {
                ...selectedJob,
                ...formData,
                updatedAt: new Date().toISOString(),
            };
            
            const jobRef = doc(db, 'jobs', selectedJob.id);
            await setDoc(jobRef, updatedJob, { merge: true });
            
            setJobs(prev => prev.map(job => job.id === selectedJob.id ? updatedJob : job));
            closeModal();
            
            console.log('Job updated:', selectedJob.id);
        } catch (error) {
            console.error('Error updating job:', error);
            alert('Failed to update job. Please try again.');
        }
    };

    const handleDeleteJob = async () => {
        if (!selectedJob) return;
        
        try {
            const jobRef = doc(db, 'jobs', selectedJob.id);
            await deleteDoc(jobRef);
            
            setJobs(prev => prev.filter(job => job.id !== selectedJob.id));
            closeModal();
            
            console.log('Job deleted:', selectedJob.id);
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Failed to delete job. Please try again.');
        }
    };

    const handleArchiveJob = async (job: Job) => {
        try {
            const updatedJob: Job = {
                ...job,
                status: 'Archived',
                updatedAt: new Date().toISOString(),
            };
            
            const jobRef = doc(db, 'jobs', job.id);
            await updateDoc(jobRef, { status: 'Archived', updatedAt: updatedJob.updatedAt });
            
            setJobs(prev => prev.map(j => j.id === job.id ? updatedJob : j));
            
            console.log('Job archived:', job.id);
        } catch (error) {
            console.error('Error archiving job:', error);
            alert('Failed to archive job. Please try again.');
        }
    };

    // Form handlers
    const updateFormField = (field: keyof JobFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateArrayField = (field: keyof JobFormData, index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayItem = (field: keyof JobFormData) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] as string[]), '']
        }));
    };

    const removeArrayItem = (field: keyof JobFormData, index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] as string[]).filter((_, i) => i !== index)
        }));
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
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold">{filteredJobs.length}</div>
                                <div className="text-gray-500">Job Listings</div>
                            </div>
                            <div className="h-16 w-px bg-gray-300"></div>
                            <div className="text-center">
                                <div className="text-4xl font-bold">{filteredJobs.filter(j => j.status === 'Active').length}</div>
                                <div className="text-gray-500">Active</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => openModal('create')}
                            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-3 rounded-lg flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Create Job Listing</span>
                        </button>
                    </div>

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
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex space-x-4 mb-6">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                            <option value="Closed">Closed</option>
                            <option value="Paused">Paused</option>
                            <option value="Archived">Archived</option>
                        </select>
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
                        <select 
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {uniqueDepartments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
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
                                                            onClick={() => openModal('view', job)}
                                                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            View
                                                        </button>
                                                        <button 
                                                            onClick={() => openModal('edit', job)}
                                                            className="text-gray-600 hover:text-gray-800 text-sm flex items-center"
                                                        >
                                                            <Edit className="w-4 h-4 mr-1" />
                                                            Edit
                                                        </button>
                                                        {job.status !== 'Archived' && (
                                                            <button 
                                                                onClick={() => handleArchiveJob(job)}
                                                                className="text-orange-600 hover:text-orange-800 text-sm flex items-center"
                                                            >
                                                                <Archive className="w-4 h-4 mr-1" />
                                                                Archive
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => openModal('delete', job)}
                                                            className="text-red-600 hover:text-red-800 text-sm flex items-center"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                            Delete
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
                        {currentModal === 'create' && (
                            <CreateEditJobModal 
                                currentModal={currentModal}
                                formData={formData}
                                closeModal={closeModal}
                                handleCreateJob={handleCreateJob}
                                handleUpdateJob={handleUpdateJob}
                                updateFormField={updateFormField}
                                updateArrayField={updateArrayField}
                                addArrayItem={addArrayItem}
                                removeArrayItem={removeArrayItem}
                            />
                        )}
                        {currentModal === 'edit' && selectedJob && (
                            <CreateEditJobModal 
                                currentModal={currentModal}
                                formData={formData}
                                closeModal={closeModal}
                                handleCreateJob={handleCreateJob}
                                handleUpdateJob={handleUpdateJob}
                                updateFormField={updateFormField}
                                updateArrayField={updateArrayField}
                                addArrayItem={addArrayItem}
                                removeArrayItem={removeArrayItem}
                            />
                        )}
                        {currentModal === 'delete' && selectedJob && (
                            <DeleteJobModal 
                                selectedJob={selectedJob}
                                closeModal={closeModal}
                                handleDeleteJob={handleDeleteJob}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminJobs;