import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Globe, Calendar, ArrowLeft, Star, StarOff } from 'lucide-react';
import { db } from '../../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface CVApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  applicantEmail: string;
  applicantName: string;
  appliedAt: string;
  status: string;
  isStarred: boolean;
  applicantCV: any;
}

const AdminCVView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cvApplication, setCvApplication] = useState<CVApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCVData = async () => {
      if (!id) {
        setError('CV ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const cvRef = doc(db, 'cv', id);
        const cvSnap = await getDoc(cvRef);
        
        if (!cvSnap.exists()) {
          setError('CV application not found');
          setLoading(false);
          return;
        }
        
        const data = cvSnap.data() as CVApplication;
        setCvApplication({ ...data, id: cvSnap.id });
        
      } catch (err) {
        console.error('Error fetching CV:', err);
        setError('Failed to load CV data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCVData();
  }, [id]);

  const toggleStar = async () => {
    if (!cvApplication) return;
    
    try {
      const cvRef = doc(db, 'cv', cvApplication.id);
      const newStarredStatus = !cvApplication.isStarred;
      
      await updateDoc(cvRef, {
        isStarred: newStarredStatus,
        reviewedAt: new Date().toISOString()
      });
      
      setCvApplication({
        ...cvApplication,
        isStarred: newStarredStatus
      });
      
    } catch (error) {
      console.error('Error updating star status:', error);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!cvApplication) return;
    
    try {
      const cvRef = doc(db, 'cv', cvApplication.id);
      
      await updateDoc(cvRef, {
        status: newStatus,
        reviewedAt: new Date().toISOString()
      });
      
      setCvApplication({
        ...cvApplication,
        status: newStatus
      });
      
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading CV details...</p>
        </div>
      </div>
    );
  }

  if (error || !cvApplication) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'CV not found'}</p>
          <button 
            onClick={() => navigate('/admin/cv')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to CV List
          </button>
        </div>
      </div>
    );
  }

  const cv = cvApplication.applicantCV;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/admin/cv')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to CV List
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleStar}
                className={`p-2 rounded-full transition-colors ${
                  cvApplication.isStarred 
                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cvApplication.isStarred ? (
                  <Star className="w-5 h-5 fill-current" />
                ) : (
                  <StarOff className="w-5 h-5" />
                )}
              </button>
              
              <select
                value={cvApplication.status}
                onChange={(e) => updateStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="interviewed">Interviewed</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Application Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">CV Application Details</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Applied for:</span> {cvApplication.jobTitle}</p>
                <p><span className="font-medium">Company:</span> {cvApplication.companyName}</p>
                <p><span className="font-medium">Applied on:</span> {new Date(cvApplication.appliedAt).toLocaleDateString()}</p>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Status:</span>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(cvApplication.status)}`}>
                    {cvApplication.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Applicant Contact</h3>
              <div className="space-y-2">
                <p className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {cvApplication.applicantName}
                </p>
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {cvApplication.applicantEmail}
                </p>
                {cv?.personalInfo?.phone && (
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {cv.personalInfo.phone}
                  </p>
                )}
                {cv?.personalInfo?.address && (
                  <p className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {cv.personalInfo.address}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CV Content */}
        {cv && (
          <>
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-gray-900">{cv.personalInfo?.fullName || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                  <p className="text-gray-900">{cv.personalInfo?.professionalTitle || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{cv.personalInfo?.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{cv.personalInfo?.phone || 'Not provided'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-gray-900">{cv.personalInfo?.address || 'Not provided'}</p>
                </div>
                {cv.personalInfo?.summary && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                    <p className="text-gray-900">{cv.personalInfo.summary}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Work Experience */}
            {cv.workExperience && cv.workExperience.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Work Experience
                </h2>
                
                <div className="space-y-6">
                  {cv.workExperience.map((work: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-6">
                      <h3 className="text-lg font-semibold text-gray-900">{work.position || work.title}</h3>
                      <p className="text-blue-600 font-medium">{work.company}</p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {work.startDate} - {work.current ? 'Present' : work.endDate}
                      </p>
                      {work.description && (
                        <p className="text-gray-700 mt-2">{work.description}</p>
                      )}
                      {work.achievements && work.achievements.length > 0 && (
                        <div className="mt-3">
                          <h4 className="font-medium text-gray-900 mb-2">Key Achievements:</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {work.achievements.map((achievement: string, idx: number) => (
                              <li key={idx}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {cv.education && cv.education.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Education
                </h2>
                
                <div className="space-y-6">
                  {cv.education.map((edu: any, index: number) => (
                    <div key={index} className="border-l-4 border-green-200 pl-6">
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-green-600 font-medium">{edu.institution}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-gray-600">{edu.fieldOfStudy}</p>
                      )}
                      <p className="text-gray-600 text-sm flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {edu.startDate} - {edu.endDate}
                      </p>
                      {edu.description && (
                        <p className="text-gray-700 mt-2">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills & Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              {cv.skills && cv.skills.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
                  <div className="space-y-3">
                    {cv.skills.map((skill: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-900">{skill.name}</span>
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {cv.languages && cv.languages.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Languages
                  </h2>
                  <div className="space-y-3">
                    {cv.languages.map((language: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-900">{language.language}</span>
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          {language.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCVView; 