import { useState } from 'react';
import { 
    Mail, 
    Phone, 
    MapPin, 
    Linkedin, 
    Github, 
    Globe, 
    Download, 
    Calendar, 
    Briefcase, 
    GraduationCap, 
    Code, 
    Award, 
    User,
    ExternalLink,
    Plus,
    Trash2,
    Edit3,
    Save,
    X
} from 'lucide-react';

const UserCV = () => {
    const [activeSection, setActiveSection] = useState('about');
    const [isEditing, setIsEditing] = useState(false);
    
    // Editable CV Data
    const [cvData, setCvData] = useState({
        personalInfo: {
            fullName: "Michael Johnson",
            professionalTitle: "Senior Full-Stack Developer",
            photo: "/api/placeholder/150/150",
            location: "Ulaanbaatar, Mongolia",
            email: "michael.johnson@email.com",
            phone: "+976 9999 1234",
            linkedin: "https://linkedin.com/in/michaeljohnson",
            github: "https://github.com/michaeljohnson",
            portfolio: "https://michaeljohnson.dev",
            availability: "Open to new opportunities"
        },
        professionalSummary: "Experienced full-stack developer with 6+ years of expertise in building scalable web applications using React, Node.js, and cloud technologies. Passionate about creating intuitive user experiences and implementing robust backend solutions. Currently seeking opportunities in fintech or healthcare technology to make meaningful impact through code.",
        skills: {
            frontend: ["React", "TypeScript", "Next.js", "TailwindCSS", "Vue.js", "JavaScript"],
            backend: ["Node.js", "Express", "Python", "PostgreSQL", "MongoDB", "Redis"],
            cloud: ["AWS", "Firebase", "Docker", "Kubernetes", "CI/CD", "Terraform"],
            tools: ["Git", "Figma", "Postman", "Jest", "Webpack", "VS Code"]
        },
        workExperience: [
            {
                title: "Senior Full-Stack Developer",
                company: "TechFlow Solutions",
                location: "Ulaanbaatar, Mongolia",
                duration: "Jan 2022 – Present",
                achievements: [
                    "Led development of customer portal serving 10,000+ users with React and Node.js",
                    "Improved application performance by 40% through code optimization and caching strategies",
                    "Mentored 3 junior developers and established code review processes",
                    "Implemented CI/CD pipeline reducing deployment time from hours to minutes"
                ],
                technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"]
            },
            {
                title: "Full-Stack Developer",
                company: "Digital Innovations LLC",
                location: "Ulaanbaatar, Mongolia", 
                duration: "Mar 2020 – Dec 2021",
                achievements: [
                    "Developed e-commerce platform handling $2M+ in annual transactions",
                    "Built responsive admin dashboard with real-time analytics using React and Firebase",
                    "Integrated payment gateways and third-party APIs for enhanced functionality",
                    "Collaborated with UX team to improve user engagement by 35%"
                ],
                technologies: ["React", "Firebase", "Stripe API", "MongoDB"]
            }
        ],
        education: [
            {
                degree: "Bachelor of Computer Science",
                university: "National University of Mongolia",
                location: "Ulaanbaatar, Mongolia",
                duration: "2014 – 2018",
                achievements: "Graduated Magna Cum Laude, Dean's List for 6 semesters"
            }
        ],
        projects: [
            {
                name: "EduTrack - Student Management System",
                description: "Comprehensive platform for educational institutions to manage students, courses, and assessments",
                technologies: ["React", "Node.js", "PostgreSQL", "Redis"],
                role: "Lead Developer",
                github: "https://github.com/michaeljohnson/edutrack",
                demo: "https://edutrack-demo.com"
            },
            {
                name: "CryptoPortfolio Tracker",
                description: "Real-time cryptocurrency portfolio management with advanced analytics and alerts",
                technologies: ["Next.js", "TypeScript", "Prisma", "Chart.js"],
                role: "Full-Stack Developer", 
                github: "https://github.com/michaeljohnson/crypto-tracker",
                demo: "https://crypto-portfolio-demo.com"
            }
        ],
        certifications: [
            {
                name: "AWS Certified Solutions Architect",
                issuer: "Amazon Web Services",
                date: "2023",
                credentialId: "AWS-SA-2023-001"
            },
            {
                name: "Google Cloud Professional Developer",
                issuer: "Google Cloud",
                date: "2022", 
                credentialId: "GCP-PD-2022-445"
            }
        ],
        languages: [
            { language: "Mongolian", proficiency: "Native" },
            { language: "English", proficiency: "Professional Proficiency" },
            { language: "Mandarin", proficiency: "Conversational" }
        ]
    });

    const updatePersonalInfo = (field: string, value: string) => {
        setCvData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [field]: value
            }
        }));
    };

    const updateProfessionalSummary = (value: string) => {
        setCvData(prev => ({
            ...prev,
            professionalSummary: value
        }));
    };

    const updateSkills = (category: string, skills: string[]) => {
        setCvData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: skills
            }
        }));
    };

    const addWorkExperience = () => {
        setCvData(prev => ({
            ...prev,
            workExperience: [
                ...prev.workExperience,
                {
                    title: "",
                    company: "",
                    location: "",
                    duration: "",
                    achievements: [""],
                    technologies: [""]
                }
            ]
        }));
    };

    const updateWorkExperience = (index: number, field: string, value: string) => {
        setCvData(prev => ({
            ...prev,
            workExperience: prev.workExperience.map((job, i) => 
                i === index ? { ...job, [field]: value } : job
            )
        }));
    };

    const removeWorkExperience = (index: number) => {
        setCvData(prev => ({
            ...prev,
            workExperience: prev.workExperience.filter((_, i) => i !== index)
        }));
    };

    const addProject = () => {
        setCvData(prev => ({
            ...prev,
            projects: [
                ...prev.projects,
                {
                    name: "",
                    description: "",
                    technologies: [""],
                    role: "",
                    github: "",
                    demo: ""
                }
            ]
        }));
    };

    const updateProject = (index: number, field: string, value: string) => {
        setCvData(prev => ({
            ...prev,
            projects: prev.projects.map((project, i) => 
                i === index ? { ...project, [field]: value } : project
            )
        }));
    };

    const removeProject = (index: number) => {
        setCvData(prev => ({
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index)
        }));
    };

    const getProfileInitials = (name: string) => {
        return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
    };

    const exportCV = () => {
        const dataStr = JSON.stringify(cvData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cv-data.json';
        link.click();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <div className="bg-blue-600 text-white">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* <h1 className="text-2xl font-bold">CV</h1> */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`flex items-center px-4 py-2 rounded-lg ${
                                    isEditing 
                                        ? 'bg-green-500 hover:bg-green-600' 
                                        : 'bg-blue-500 hover:bg-blue-700'
                                }`}
                            >
                                {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                                {isEditing ? 'Save Changes' : 'Edit Mode'}
                            </button>
                            <button
                                onClick={exportCV}
                                className="flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                        {/* Profile Photo */}
                        <div className="relative">
                            <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                {getProfileInitials(cvData.personalInfo.fullName)}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Available
                            </div>
                        </div>
                        
                        {/* Personal Info */}
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={cvData.personalInfo.fullName}
                                        onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                                        className="text-4xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-300 focus:border-blue-500 outline-none w-full"
                                        placeholder="Full Name"
                                    />
                                    <input
                                        type="text"
                                        value={cvData.personalInfo.professionalTitle}
                                        onChange={(e) => updatePersonalInfo('professionalTitle', e.target.value)}
                                        className="text-2xl text-blue-600 font-medium bg-transparent border-b-2 border-blue-300 focus:border-blue-500 outline-none w-full"
                                        placeholder="Professional Title"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={cvData.personalInfo.location}
                                            onChange={(e) => updatePersonalInfo('location', e.target.value)}
                                            className="p-2 border rounded"
                                            placeholder="Location"
                                        />
                                        <input
                                            type="email"
                                            value={cvData.personalInfo.email}
                                            onChange={(e) => updatePersonalInfo('email', e.target.value)}
                                            className="p-2 border rounded"
                                            placeholder="Email"
                                        />
                                        <input
                                            type="tel"
                                            value={cvData.personalInfo.phone}
                                            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                                            className="p-2 border rounded"
                                            placeholder="Phone"
                                        />
                                        <input
                                            type="text"
                                            value={cvData.personalInfo.availability}
                                            onChange={(e) => updatePersonalInfo('availability', e.target.value)}
                                            className="p-2 border rounded"
                                            placeholder="Availability Status"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input
                                            type="url"
                                            value={cvData.personalInfo.linkedin}
                                            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                                            className="p-2 border rounded"
                                            placeholder="LinkedIn URL"
                                        />
                                        <input
                                            type="url"
                                            value={cvData.personalInfo.github}
                                            onChange={(e) => updatePersonalInfo('github', e.target.value)}
                                            className="p-2 border rounded"
                                            placeholder="GitHub URL"
                                        />
                                        <input
                                            type="url"
                                            value={cvData.personalInfo.portfolio}
                                            onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                                            className="p-2 border rounded"
                                            placeholder="Portfolio URL"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                        {cvData.personalInfo.fullName}
                                    </h1>
                                    <h2 className="text-2xl text-blue-600 font-medium mb-4">
                                        {cvData.personalInfo.professionalTitle}
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 mb-6">
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {cvData.personalInfo.location}
                                        </div>
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-2" />
                                            {cvData.personalInfo.email}
                                        </div>
                                        <div className="flex items-center">
                                            <Phone className="w-4 h-4 mr-2" />
                                            {cvData.personalInfo.phone}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {cvData.personalInfo.availability}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-4">
                                        <a href={cvData.personalInfo.linkedin} className="flex items-center text-blue-600 hover:text-blue-800">
                                            <Linkedin className="w-4 h-4 mr-2" />
                                            LinkedIn
                                        </a>
                                        <a href={cvData.personalInfo.github} className="flex items-center text-gray-700 hover:text-gray-900">
                                            <Github className="w-4 h-4 mr-2" />
                                            GitHub
                                        </a>
                                        <a href={cvData.personalInfo.portfolio} className="flex items-center text-green-600 hover:text-green-800">
                                            <Globe className="w-4 h-4 mr-2" />
                                            Portfolio
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Navigation */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {['about', 'experience', 'projects', 'education'].map((section) => (
                            <button
                                key={section}
                                onClick={() => setActiveSection(section)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                                    activeSection === section
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {section}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Professional Summary */}
                        {activeSection === 'about' && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                    <User className="w-6 h-6 mr-2 text-blue-600" />
                                    Professional Summary
                                </h3>
                                {isEditing ? (
                                    <textarea
                                        value={cvData.professionalSummary}
                                        onChange={(e) => updateProfessionalSummary(e.target.value)}
                                        className="w-full h-32 p-3 border rounded-lg resize-none"
                                        placeholder="Write your professional summary..."
                                    />
                                ) : (
                                    <p className="text-gray-700 leading-relaxed text-lg">
                                        {cvData.professionalSummary}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Work Experience */}
                        {activeSection === 'experience' && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <Briefcase className="w-6 h-6 mr-2 text-blue-600" />
                                        Work Experience
                                    </h3>
                                    {isEditing && (
                                        <button
                                            onClick={addWorkExperience}
                                            className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add Job
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-8">
                                    {cvData.workExperience.map((job, index) => (
                                        <div key={index} className="border-l-4 border-blue-200 pl-6 pb-6 relative">
                                            {isEditing && (
                                                <button
                                                    onClick={() => removeWorkExperience(index)}
                                                    className="absolute -left-2 top-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                            {isEditing ? (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <input
                                                            type="text"
                                                            value={job.title}
                                                            onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                                                            className="p-2 border rounded"
                                                            placeholder="Job Title"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={job.duration}
                                                            onChange={(e) => updateWorkExperience(index, 'duration', e.target.value)}
                                                            className="p-2 border rounded"
                                                            placeholder="Duration"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={job.company}
                                                            onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                                                            className="p-2 border rounded"
                                                            placeholder="Company"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={job.location}
                                                            onChange={(e) => updateWorkExperience(index, 'location', e.target.value)}
                                                            className="p-2 border rounded"
                                                            placeholder="Location"
                                                        />
                                                    </div>
                                                    <textarea
                                                        value={job.achievements.join('\n')}
                                                        onChange={(e) => updateWorkExperience(index, 'achievements', e.target.value.split('\n').filter(a => a.trim()).join('\n'))}
                                                        className="w-full h-24 p-3 border rounded"
                                                        placeholder="Achievements (one per line)"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={job.technologies.join(', ')}
                                                        onChange={(e) => updateWorkExperience(index, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t).join(','))}
                                                        className="w-full p-2 border rounded"
                                                        placeholder="Technologies (comma-separated)"
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                                        <h4 className="text-xl font-semibold text-gray-900">{job.title}</h4>
                                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                            {job.duration}
                                                        </span>
                                                    </div>
                                                    <p className="text-blue-600 font-medium mb-4">{job.company} • {job.location}</p>
                                                    <ul className="space-y-2 text-gray-700 mb-4">
                                                        {job.achievements.map((achievement, idx) => (
                                                            <li key={idx} className="flex items-start">
                                                                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                                {achievement}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="flex flex-wrap gap-2">
                                                        {job.technologies.map((tech, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects */}
                        {activeSection === 'projects' && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <Code className="w-6 h-6 mr-2 text-blue-600" />
                                        Featured Projects
                                    </h3>
                                    {isEditing && (
                                        <button
                                            onClick={addProject}
                                            className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add Project
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    {cvData.projects.map((project, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow relative">
                                            {isEditing && (
                                                <button
                                                    onClick={() => removeProject(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                            {isEditing ? (
                                                <div className="space-y-4">
                                                    <input
                                                        type="text"
                                                        value={project.name}
                                                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                                                        className="w-full p-2 border rounded font-semibold"
                                                        placeholder="Project Name"
                                                    />
                                                    <textarea
                                                        value={project.description}
                                                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                                                        className="w-full h-20 p-2 border rounded"
                                                        placeholder="Project Description"
                                                    />
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <input
                                                            type="text"
                                                            value={project.role}
                                                            onChange={(e) => updateProject(index, 'role', e.target.value)}
                                                            className="p-2 border rounded"
                                                            placeholder="Your Role"
                                                        />
                                                        <input
                                                            type="url"
                                                            value={project.github}
                                                            onChange={(e) => updateProject(index, 'github', e.target.value)}
                                                            className="p-2 border rounded"
                                                            placeholder="GitHub URL"
                                                        />
                                                        <input
                                                            type="url"
                                                            value={project.demo}
                                                            onChange={(e) => updateProject(index, 'demo', e.target.value)}
                                                            className="p-2 border rounded"
                                                            placeholder="Demo URL"
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={project.technologies.join(', ')}
                                                        onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t).join(','))}
                                                        className="w-full p-2 border rounded"
                                                        placeholder="Technologies (comma-separated)"
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="flex items-start justify-between mb-3">
                                                        <h4 className="text-xl font-semibold text-gray-900">{project.name}</h4>
                                                        <div className="flex space-x-2">
                                                            <a href={project.github} className="text-gray-600 hover:text-gray-800">
                                                                <Github className="w-5 h-5" />
                                                            </a>
                                                            {project.demo && (
                                                                <a href={project.demo} className="text-blue-600 hover:text-blue-800">
                                                                    <ExternalLink className="w-5 h-5" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 mb-3">{project.description}</p>
                                                    <p className="text-sm text-blue-600 mb-4">Role: {project.role}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.technologies.map((tech, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {activeSection === 'education' && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <GraduationCap className="w-6 h-6 mr-2 text-blue-600" />
                                    Education
                                </h3>
                                {cvData.education.map((edu, index) => (
                                    <div key={index} className="border-l-4 border-green-200 pl-6">
                                        {isEditing ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={edu.degree}
                                                        onChange={(e) => setCvData(prev => ({
                                                            ...prev,
                                                            education: prev.education.map((item, i) => 
                                                                i === index ? { ...item, degree: e.target.value } : item
                                                            )
                                                        }))}
                                                        className="p-2 border rounded"
                                                        placeholder="Degree"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={edu.duration}
                                                        onChange={(e) => setCvData(prev => ({
                                                            ...prev,
                                                            education: prev.education.map((item, i) => 
                                                                i === index ? { ...item, duration: e.target.value } : item
                                                            )
                                                        }))}
                                                        className="p-2 border rounded"
                                                        placeholder="Duration"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={edu.university}
                                                        onChange={(e) => setCvData(prev => ({
                                                            ...prev,
                                                            education: prev.education.map((item, i) => 
                                                                i === index ? { ...item, university: e.target.value } : item
                                                            )
                                                        }))}
                                                        className="p-2 border rounded"
                                                        placeholder="University"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={edu.location}
                                                        onChange={(e) => setCvData(prev => ({
                                                            ...prev,
                                                            education: prev.education.map((item, i) => 
                                                                i === index ? { ...item, location: e.target.value } : item
                                                            )
                                                        }))}
                                                        className="p-2 border rounded"
                                                        placeholder="Location"
                                                    />
                                                </div>
                                                <textarea
                                                    value={edu.achievements}
                                                    onChange={(e) => setCvData(prev => ({
                                                        ...prev,
                                                        education: prev.education.map((item, i) => 
                                                            i === index ? { ...item, achievements: e.target.value } : item
                                                        )
                                                    }))}
                                                    className="w-full h-20 p-2 border rounded"
                                                    placeholder="Achievements & Honors"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                                    <h4 className="text-xl font-semibold text-gray-900">{edu.degree}</h4>
                                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                        {edu.duration}
                                                    </span>
                                                </div>
                                                <p className="text-green-600 font-medium mb-2">{edu.university} • {edu.location}</p>
                                                <p className="text-gray-700">{edu.achievements}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Skills */}
                        {(activeSection === 'skills' || activeSection === 'about') && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Skills & Technologies</h3>
                                <div className="space-y-4">
                                    {Object.entries(cvData.skills).map(([category, skills]) => (
                                        <div key={category}>
                                            <h4 className="font-medium text-gray-800 mb-2 capitalize">{category}</h4>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={skills.join(', ')}
                                                    onChange={(e) => updateSkills(category, e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                                                    className="w-full p-2 border rounded text-sm"
                                                    placeholder={`${category} skills (comma-separated)`}
                                                />
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {skills.map((skill, index) => (
                                                        <span key={index} className={`px-2 py-1 rounded text-sm ${
                                                            category === 'frontend' ? 'bg-blue-100 text-blue-800' :
                                                            category === 'backend' ? 'bg-green-100 text-green-800' :
                                                            category === 'cloud' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certifications */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                    <Award className="w-5 h-5 mr-2 text-yellow-500" />
                                    Certifications
                                </h3>
                                {isEditing && (
                                    <button
                                        onClick={() => setCvData(prev => ({
                                            ...prev,
                                            certifications: [...prev.certifications, { name: "", issuer: "", date: "", credentialId: "" }]
                                        }))}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="space-y-4">
                                {cvData.certifications.map((cert, index) => (
                                    <div key={index} className="border-l-4 border-yellow-200 pl-4 relative">
                                        {isEditing && (
                                            <button
                                                onClick={() => setCvData(prev => ({
                                                    ...prev,
                                                    certifications: prev.certifications.filter((_, i) => i !== index)
                                                }))}
                                                className="absolute -left-2 top-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                            >
                                                <X className="w-2 h-2" />
                                            </button>
                                        )}
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={cert.name}
                                                    onChange={(e) => setCvData(prev => ({
                                                        ...prev,
                                                        certifications: prev.certifications.map((item, i) => 
                                                            i === index ? { ...item, name: e.target.value } : item
                                                        )
                                                    }))}
                                                    className="w-full p-1 border rounded text-sm"
                                                    placeholder="Certification Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={cert.issuer}
                                                    onChange={(e) => setCvData(prev => ({
                                                        ...prev,
                                                        certifications: prev.certifications.map((item, i) => 
                                                            i === index ? { ...item, issuer: e.target.value } : item
                                                        )
                                                    }))}
                                                    className="w-full p-1 border rounded text-sm"
                                                    placeholder="Issuer"
                                                />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        type="text"
                                                        value={cert.date}
                                                        onChange={(e) => setCvData(prev => ({
                                                            ...prev,
                                                            certifications: prev.certifications.map((item, i) => 
                                                                i === index ? { ...item, date: e.target.value } : item
                                                            )
                                                        }))}
                                                        className="p-1 border rounded text-sm"
                                                        placeholder="Year"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={cert.credentialId}
                                                        onChange={(e) => setCvData(prev => ({
                                                            ...prev,
                                                            certifications: prev.certifications.map((item, i) => 
                                                                i === index ? { ...item, credentialId: e.target.value } : item
                                                            )
                                                        }))}
                                                        className="p-1 border rounded text-sm"
                                                        placeholder="ID"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                                                <p className="text-sm text-gray-600">{cert.issuer} • {cert.date}</p>
                                                <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                    <Globe className="w-5 h-5 mr-2 text-blue-500" />
                                    Languages
                                </h3>
                                {isEditing && (
                                    <button
                                        onClick={() => setCvData(prev => ({
                                            ...prev,
                                            languages: [...prev.languages, { language: "", proficiency: "" }]
                                        }))}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="space-y-3">
                                {cvData.languages.map((lang, index) => (
                                    <div key={index} className="flex justify-between items-center relative">
                                        {isEditing && (
                                            <button
                                                onClick={() => setCvData(prev => ({
                                                    ...prev,
                                                    languages: prev.languages.filter((_, i) => i !== index)
                                                }))}
                                                className="absolute -left-3 top-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                            >
                                                <X className="w-2 h-2" />
                                            </button>
                                        )}
                                        {isEditing ? (
                                            <div className="flex space-x-2 w-full">
                                                <input
                                                    type="text"
                                                    value={lang.language}
                                                    onChange={(e) => setCvData(prev => ({
                                                        ...prev,
                                                        languages: prev.languages.map((item, i) => 
                                                            i === index ? { ...item, language: e.target.value } : item
                                                        )
                                                    }))}
                                                    className="flex-1 p-1 border rounded text-sm"
                                                    placeholder="Language"
                                                />
                                                <select
                                                    value={lang.proficiency}
                                                    onChange={(e) => setCvData(prev => ({
                                                        ...prev,
                                                        languages: prev.languages.map((item, i) => 
                                                            i === index ? { ...item, proficiency: e.target.value } : item
                                                        )
                                                    }))}
                                                    className="p-1 border rounded text-sm"
                                                >
                                                    <option value="">Select Level</option>
                                                    <option value="Native">Native</option>
                                                    <option value="Professional Proficiency">Professional</option>
                                                    <option value="Conversational">Conversational</option>
                                                    <option value="Basic">Basic</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-gray-900">{lang.language}</span>
                                                <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                                    {lang.proficiency}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCV;