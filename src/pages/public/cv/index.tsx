import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Globe, Plus, Edit, Save, X, FileText } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  professionalTitle: string;
  summary: string;
  photo?: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface Language {
  language: string;
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native';
}

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface CVData {
  personalInfo: PersonalInfo;
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skill[];
  languages: Language[];
  lastUpdated: string;
}

const UserCV = () => {
  const { user } = useAuth();
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCVData = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        const userRef = doc(db, 'users', user.email);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.CV) {
            setCvData(userData.CV);
          } else {
            // Initialize empty CV
            const emptyCV: CVData = {
              personalInfo: {
                fullName: user.name || '',
                email: user.email || '',
                phone: '',
                address: '',
                professionalTitle: '',
                summary: '',
                photo: user.picture || undefined
              },
              education: [],
              workExperience: [],
              skills: [],
              languages: [],
              lastUpdated: new Date().toISOString()
            };
            setCvData(emptyCV);
          }
        }
      } catch (error) {
        console.error('Error fetching CV data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCVData();
  }, []);

  const handleSave = async () => {
    if (!user?.email || !cvData) return;

    try {
      setSaving(true);
      const userRef = doc(db, 'users', user.email);
      
      const updatedCV = {
        ...cvData,
        lastUpdated: new Date().toISOString()
      };

      await setDoc(userRef, {
        CV: updatedCV,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: 'user'
      }, { merge: true });

      setCvData(updatedCV);
      setEditing(false);
      alert('CV saved successfully!');
    } catch (error) {
      console.error('Error saving CV:', error);
      alert('Failed to save CV. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addEducation = () => {
    if (!cvData) return;
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setCvData({
      ...cvData,
      education: [...cvData.education, newEducation]
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    if (!cvData) return;
    setCvData({
      ...cvData,
      education: cvData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    if (!cvData) return;
    setCvData({
      ...cvData,
      education: cvData.education.filter(edu => edu.id !== id)
    });
  };

  const addWorkExperience = () => {
    if (!cvData) return;
    const newWork: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    };
    setCvData({
      ...cvData,
      workExperience: [...cvData.workExperience, newWork]
    });
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    if (!cvData) return;
    setCvData({
      ...cvData,
      workExperience: cvData.workExperience.map(work => 
        work.id === id ? { ...work, [field]: value } : work
      )
    });
  };

  const removeWorkExperience = (id: string) => {
    if (!cvData) return;
    setCvData({
      ...cvData,
      workExperience: cvData.workExperience.filter(work => work.id !== id)
    });
  };

  const addSkill = () => {
    if (!cvData) return;
    const newSkill: Skill = { name: '', level: 'Beginner' };
    setCvData({
      ...cvData,
      skills: [...cvData.skills, newSkill]
    });
  };

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    if (!cvData) return;
    const updatedSkills = [...cvData.skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setCvData({
      ...cvData,
      skills: updatedSkills
    });
  };

  const removeSkill = (index: number) => {
    if (!cvData) return;
    setCvData({
      ...cvData,
      skills: cvData.skills.filter((_, i) => i !== index)
    });
  };

  const addLanguage = () => {
    if (!cvData) return;
    const newLanguage: Language = { language: '', proficiency: 'Basic' };
    setCvData({
      ...cvData,
      languages: [...cvData.languages, newLanguage]
    });
  };

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    if (!cvData) return;
    const updatedLanguages = [...cvData.languages];
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
    setCvData({
      ...cvData,
      languages: updatedLanguages
    });
  };

  const removeLanguage = (index: number) => {
    if (!cvData) return;
    setCvData({
      ...cvData,
      languages: cvData.languages.filter((_, i) => i !== index)
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view your CV.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your CV...</p>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">CV not found</h2>
          <p className="text-gray-600">Unable to load your CV data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {cvData.personalInfo.fullName?.charAt(0) || user.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My CV</h1>
                <p className="text-gray-600">
                  Last updated: {new Date(cvData.lastUpdated).toLocaleDateString()}
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
                  <span>Edit CV</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
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
                  value={cvData.personalInfo.fullName}
                  onChange={(e) => setCvData({
                    ...cvData,
                    personalInfo: { ...cvData.personalInfo, fullName: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{cvData.personalInfo.fullName || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
              {editing ? (
                <input
                  type="text"
                  value={cvData.personalInfo.professionalTitle}
                  onChange={(e) => setCvData({
                    ...cvData,
                    personalInfo: { ...cvData.personalInfo, professionalTitle: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{cvData.personalInfo.professionalTitle || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {cvData.personalInfo.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {editing ? (
                <input
                  type="text"
                  value={cvData.personalInfo.phone}
                  onChange={(e) => setCvData({
                    ...cvData,
                    personalInfo: { ...cvData.personalInfo, phone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {cvData.personalInfo.phone || 'Not provided'}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {editing ? (
                <input
                  type="text"
                  value={cvData.personalInfo.address}
                  onChange={(e) => setCvData({
                    ...cvData,
                    personalInfo: { ...cvData.personalInfo, address: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {cvData.personalInfo.address || 'Not provided'}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
              {editing ? (
                <textarea
                  value={cvData.personalInfo.summary}
                  onChange={(e) => setCvData({
                    ...cvData,
                    personalInfo: { ...cvData.personalInfo, summary: e.target.value }
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{cvData.personalInfo.summary || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Work Experience
            </h2>
            {editing && (
              <button
                onClick={addWorkExperience}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            )}
          </div>
          
          {cvData.workExperience.length === 0 ? (
            <p className="text-gray-500">No work experience added yet.</p>
          ) : (
            <div className="space-y-4">
              {cvData.workExperience.map((work) => (
                <div key={work.id} className="border border-gray-200 rounded-lg p-4">
                  {editing ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                          <input
                            type="text"
                            placeholder="Company"
                            value={work.company}
                            onChange={(e) => updateWorkExperience(work.id, 'company', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Position"
                            value={work.position}
                            onChange={(e) => updateWorkExperience(work.id, 'position', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="date"
                            placeholder="Start Date"
                            value={work.startDate}
                            onChange={(e) => updateWorkExperience(work.id, 'startDate', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <div className="flex items-center space-x-2">
                            <input
                              type="date"
                              placeholder="End Date"
                              value={work.endDate}
                              disabled={work.current}
                              onChange={(e) => updateWorkExperience(work.id, 'endDate', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            />
                            <label className="flex items-center space-x-1">
                              <input
                                type="checkbox"
                                checked={work.current}
                                onChange={(e) => updateWorkExperience(work.id, 'current', e.target.checked)}
                                className="rounded"
                              />
                              <span className="text-sm">Current</span>
                            </label>
                          </div>
                        </div>
                        <button
                          onClick={() => removeWorkExperience(work.id)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        placeholder="Description"
                        value={work.description}
                        onChange={(e) => updateWorkExperience(work.id, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-gray-900">{work.position}</h3>
                      <p className="text-blue-600 font-medium">{work.company}</p>
                      <p className="text-gray-600 text-sm">
                        {work.startDate} - {work.current ? 'Present' : work.endDate}
                      </p>
                      <p className="text-gray-700 mt-2">{work.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              Education
            </h2>
            {editing && (
              <button
                onClick={addEducation}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            )}
          </div>
          
          {cvData.education.length === 0 ? (
            <p className="text-gray-500">No education added yet.</p>
          ) : (
            <div className="space-y-4">
              {cvData.education.map((edu) => (
                <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                  {editing ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                          <input
                            type="text"
                            placeholder="Institution"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Field of Study"
                            value={edu.fieldOfStudy}
                            onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <div className="flex space-x-2">
                            <input
                              type="date"
                              placeholder="Start Date"
                              value={edu.startDate}
                              onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="date"
                              placeholder="End Date"
                              value={edu.endDate}
                              onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        placeholder="Description"
                        value={edu.description}
                        onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-blue-600 font-medium">{edu.institution}</p>
                      <p className="text-gray-600 text-sm">{edu.fieldOfStudy}</p>
                      <p className="text-gray-600 text-sm">{edu.startDate} - {edu.endDate}</p>
                      {edu.description && <p className="text-gray-700 mt-2">{edu.description}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills & Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
              {editing && (
                <button
                  onClick={addSkill}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              )}
            </div>
            {cvData?.skills?.length === 0 ? (
              <p className="text-gray-500">No skills added yet.</p>
            ) : (
              <div className="space-y-2">
                {cvData?.skills?.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    {editing ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="text"
                          placeholder="Skill name"
                          value={skill.name}
                          onChange={(e) => updateSkill(index, 'name', e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <select
                          value={skill.level}
                          onChange={(e) => updateSkill(index, 'level', e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                        <button
                          onClick={() => removeSkill(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-gray-900">{skill.name}</span>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {skill.level}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Languages */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Languages
              </h2>
              {editing && (
                <button
                  onClick={addLanguage}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              )}
            </div>
            
            {cvData.languages.length === 0 ? (
              <p className="text-gray-500">No languages added yet.</p>
            ) : (
              <div className="space-y-2">
                {cvData.languages.map((language, index) => (
                  <div key={index} className="flex items-center justify-between">
                    {editing ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="text"
                          placeholder="Language"
                          value={language.language}
                          onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <select
                          value={language.proficiency}
                          onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Basic">Basic</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Native">Native</option>
                        </select>
                        <button
                          onClick={() => removeLanguage(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-gray-900">{language.language}</span>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {language.proficiency}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCV;