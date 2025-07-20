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
    Star,
    Quote
} from 'lucide-react';

const AdminCVView = () => {
    const [activeSection, setActiveSection] = useState('about');
    
    // CV Data
    const cvData = {
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
            },
            {
                title: "Frontend Developer",
                company: "StartupHub Mongolia",
                location: "Ulaanbaatar, Mongolia",
                duration: "Jun 2018 – Feb 2020", 
                achievements: [
                    "Created responsive web applications for 5+ startup clients",
                    "Implemented modern UI/UX designs with 98% client satisfaction rate",
                    "Optimized websites for SEO resulting in 50% increase in organic traffic",
                    "Worked closely with designers to translate mockups into pixel-perfect interfaces"
                ],
                technologies: ["HTML5", "CSS3", "JavaScript", "React", "SCSS"]
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
            },
            {
                name: "Local Business Directory API",
                description: "RESTful API service for managing local business listings with geolocation features",
                technologies: ["Express", "MongoDB", "JWT", "Google Maps API"],
                role: "Backend Developer",
                github: "https://github.com/michaeljohnson/business-api",
                demo: null
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
            },
            {
                name: "React Advanced Patterns",
                issuer: "Frontend Masters",
                date: "2021",
                credentialId: "FM-RAP-2021"
            }
        ],
        languages: [
            { language: "Mongolian", proficiency: "Native" },
            { language: "English", proficiency: "Professional Proficiency" },
            { language: "Mandarin", proficiency: "Conversational" },
            { language: "Japanese", proficiency: "Basic" }
        ],
        testimonials: [
            {
                name: "Sarah Chen",
                title: "Product Manager at TechFlow Solutions",
                content: "Michael is an exceptional developer who consistently delivers high-quality solutions. His technical expertise and collaborative approach make him invaluable to any team.",
                rating: 5
            },
            {
                name: "David Park",
                title: "CTO at Digital Innovations",
                content: "Working with Michael was a pleasure. He has a keen eye for detail and the ability to translate complex requirements into elegant code solutions.",
                rating: 5
            }
        ]
    };

    const getProfileInitials = (name: string) => {
        return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, index) => (
            <Star 
                key={index} 
                className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                        {/* Profile Photo */}
                        <div className="relative">
                            {cvData.personalInfo.photo ? (
                                <img 
                                    src={cvData.personalInfo.photo}
                                    alt={cvData.personalInfo.fullName}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                    {getProfileInitials(cvData.personalInfo.fullName)}
                                </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Available
                            </div>
                        </div>
                        
                        {/* Personal Info */}
                        <div className="flex-1">
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
                            
                            {/* Social Links */}
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
                                <button className="flex items-center text-purple-600 hover:text-purple-800">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download CV
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Navigation */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {['about', 'experience', 'projects', 'education', 'skills', 'testimonials'].map((section) => (
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
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {cvData.professionalSummary}
                                </p>
                            </div>
                        )}

                        {/* Work Experience */}
                        {activeSection === 'experience' && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <Briefcase className="w-6 h-6 mr-2 text-blue-600" />
                                    Work Experience
                                </h3>
                                <div className="space-y-8">
                                    {cvData.workExperience.map((job, index) => (
                                        <div key={index} className="border-l-4 border-blue-200 pl-6 pb-6">
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
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects */}
                        {activeSection === 'projects' && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <Code className="w-6 h-6 mr-2 text-blue-600" />
                                    Featured Projects
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                    {cvData.projects.map((project, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
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
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                            <h4 className="text-xl font-semibold text-gray-900">{edu.degree}</h4>
                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {edu.duration}
                                            </span>
                                        </div>
                                        <p className="text-green-600 font-medium mb-2">{edu.university} • {edu.location}</p>
                                        <p className="text-gray-700">{edu.achievements}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Testimonials */}
                        {activeSection === 'testimonials' && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <Quote className="w-6 h-6 mr-2 text-blue-600" />
                                    Testimonials
                                </h3>
                                <div className="space-y-6">
                                    {cvData.testimonials.map((testimonial, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-6">
                                            <div className="flex items-center mb-4">
                                                {renderStars(testimonial.rating)}
                                            </div>
                                            <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                                            <div className="text-sm">
                                                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                                <p className="text-gray-600">{testimonial.title}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                                    <div>
                                        <h4 className="font-medium text-gray-800 mb-2">Frontend</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {cvData.skills.frontend.map((skill, index) => (
                                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800 mb-2">Backend</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {cvData.skills.backend.map((skill, index) => (
                                                <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800 mb-2">Cloud & DevOps</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {cvData.skills.cloud.map((skill, index) => (
                                                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800 mb-2">Tools</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {cvData.skills.tools.map((skill, index) => (
                                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Certifications */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                                Certifications
                            </h3>
                            <div className="space-y-4">
                                {cvData.certifications.map((cert, index) => (
                                    <div key={index} className="border-l-4 border-yellow-200 pl-4">
                                        <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                                        <p className="text-sm text-gray-600">{cert.issuer} • {cert.date}</p>
                                        <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Globe className="w-5 h-5 mr-2 text-blue-500" />
                                Languages
                            </h3>
                            <div className="space-y-3">
                                {cvData.languages.map((lang, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-gray-900">{lang.language}</span>
                                        <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                            {lang.proficiency}
                                        </span>
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

export default AdminCVView;