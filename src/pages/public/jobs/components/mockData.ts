export type Job = {
    id: string;
    title: string;
    position: string;
    company: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
    status: 'Active' | 'Draft' | 'Closed' | 'Paused' | 'Archived';
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
    postedDate: string;
    applicationsCount: number;
    createdAt: string;
    updatedAt: string;
    jobId: string;
};

// export const mockJobsData: Job[] = [
//     {
//         id: '1',
//         title: 'Senior Frontend Developer',
//         position: 'Senior Software Engineer',
//         company: 'TechCorp',
//         location: 'London, UK',
//         type: 'Full-time',
//         status: 'Active',
//         description: 'We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for building high-quality, scalable web applications using modern JavaScript frameworks. The ideal candidate should have experience with React, TypeScript, and modern build tools.',
//         requirements: [
//             '5+ years of experience in frontend development',
//             'Expert knowledge of React and TypeScript',
//             'Experience with state management libraries (Redux, Zustand)',
//             'Proficiency in modern CSS frameworks (Tailwind, Styled Components)',
//             'Experience with testing frameworks (Jest, React Testing Library)',
//             'Strong understanding of web performance optimization'
//         ],
//         responsibilities: [
//             'Develop and maintain user-facing web applications',
//             'Collaborate with designers to implement pixel-perfect UI components',
//             'Write clean, maintainable, and well-tested code',
//             'Optimize applications for maximum speed and scalability',
//             'Mentor junior developers and conduct code reviews',
//             'Stay up-to-date with the latest frontend technologies and best practices'
//         ],
//         benefits: [
//             'Competitive salary with annual bonus',
//             'Health and dental insurance',
//             'Flexible working hours and remote work options',
//             '25 days paid vacation plus bank holidays',
//             'Professional development budget (£2,000/year)',
//             'Modern equipment and ergonomic workspace'
//         ],
//         experienceLevel: '5-7 years',
//         workingHours: '40 hours/week',
//         salaryMin: 70000,
//         salaryMax: 95000,
//         currency: 'GBP',
//         skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Redux', 'Tailwind', 'Jest'],
//         department: 'Engineering',
//         education: "Bachelor's degree in Computer Science or equivalent experience",
//         applicationDeadline: '2024-02-15',
//         postedDate: '2024-01-15',
//         applicationsCount: 23,
//         createdAt: '2024-01-15T09:00:00Z',
//         updatedAt: '2024-01-15T09:00:00Z'
//     },
//     {
//         id: '2',
//         title: 'Product Manager',
//         position: 'Senior Product Manager',
//         company: 'InnovateHub',
//         location: 'Manchester, UK',
//         type: 'Full-time',
//         status: 'Active',
//         description: 'Join our product team as a Senior Product Manager to drive the strategy and execution of our core platform. You will work closely with engineering, design, and business stakeholders to deliver exceptional user experiences and drive business growth.',
//         requirements: [
//             '4+ years of product management experience',
//             'Experience with B2B SaaS products',
//             'Strong analytical and data-driven decision making skills',
//             'Excellent communication and stakeholder management abilities',
//             'Experience with product analytics tools (Mixpanel, Amplitude)',
//             'Understanding of agile development methodologies'
//         ],
//         responsibilities: [
//             'Define and execute product roadmaps aligned with business objectives',
//             'Conduct user research and gather customer feedback',
//             'Collaborate with engineering teams to deliver high-quality features',
//             'Analyze product metrics and user behavior to drive improvements',
//             'Work with design teams to create intuitive user experiences',
//             'Communicate product vision and strategy to stakeholders'
//         ],
//         benefits: [
//             'Competitive salary with equity options',
//             'Comprehensive health and wellness package',
//             'Flexible hybrid working arrangement',
//             '30 days paid vacation',
//             'Annual learning and development stipend',
//             'Team retreats and social events'
//         ],
//         experienceLevel: '4-6 years',
//         workingHours: '37.5 hours/week',
//         salaryMin: 65000,
//         salaryMax: 85000,
//         currency: 'GBP',
//         skills: ['Product Strategy', 'User Research', 'Analytics', 'Agile', 'Roadmapping', 'Stakeholder Management'],
//         department: 'Product',
//         education: "Bachelor's degree in Business, Engineering, or related field",
//         applicationDeadline: '2024-02-20',
//         postedDate: '2024-01-10',
//         applicationsCount: 18,
//         createdAt: '2024-01-10T10:30:00Z',
//         updatedAt: '2024-01-10T10:30:00Z'
//     },
//     {
//         id: '3',
//         title: 'UX/UI Designer',
//         position: 'Mid-Level Designer',
//         company: 'DesignFlow',
//         location: 'Remote (UK)',
//         type: 'Remote',
//         status: 'Active',
//         description: 'We are seeking a talented UX/UI Designer to join our creative team. You will be responsible for designing intuitive and engaging user interfaces for our digital products. The role involves conducting user research, creating wireframes, prototypes, and high-fidelity designs.',
//         requirements: [
//             '3+ years of UX/UI design experience',
//             'Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)',
//             'Strong understanding of user-centered design principles',
//             'Experience with design systems and component libraries',
//             'Knowledge of accessibility standards and best practices',
//             'Portfolio demonstrating strong design process and outcomes'
//         ],
//         responsibilities: [
//             'Design user-friendly interfaces for web and mobile applications',
//             'Conduct user research and usability testing',
//             'Create wireframes, prototypes, and high-fidelity mockups',
//             'Maintain and evolve the design system',
//             'Collaborate with product managers and developers',
//             'Present design concepts and rationale to stakeholders'
//         ],
//         benefits: [
//             'Fully remote position with flexible hours',
//             'Competitive salary with performance bonuses',
//             'Top-tier design tools and equipment provided',
//             '28 days paid vacation',
//             'Professional conference attendance budget',
//             'Mental health and wellness support'
//         ],
//         experienceLevel: '3-5 years',
//         workingHours: 'Flexible hours',
//         salaryMin: 45000,
//         salaryMax: 60000,
//         currency: 'GBP',
//         skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility', 'Adobe Creative Suite'],
//         department: 'Design',
//         education: "Bachelor's degree in Design, HCI, or related field",
//         applicationDeadline: '2024-02-25',
//         postedDate: '2024-01-08',
//         applicationsCount: 31,
//         createdAt: '2024-01-08T14:15:00Z',
//         updatedAt: '2024-01-08T14:15:00Z'
//     },
//     {
//         id: '4',
//         title: 'DevOps Engineer',
//         position: 'Senior DevOps Engineer',
//         company: 'CloudTech Solutions',
//         location: 'Edinburgh, UK',
//         type: 'Full-time',
//         status: 'Draft',
//         description: 'Join our infrastructure team as a Senior DevOps Engineer to build and maintain scalable cloud infrastructure. You will work with cutting-edge technologies to ensure our systems are reliable, secure, and performant. This role involves automation, monitoring, and continuous improvement of our deployment processes.',
//         requirements: [
//             '5+ years of DevOps/Infrastructure experience',
//             'Strong experience with AWS or Azure cloud platforms',
//             'Proficiency in Infrastructure as Code (Terraform, CloudFormation)',
//             'Experience with containerization (Docker, Kubernetes)',
//             'Knowledge of CI/CD pipelines and automation tools',
//             'Scripting skills in Python, Bash, or PowerShell'
//         ],
//         responsibilities: [
//             'Design and maintain cloud infrastructure architecture',
//             'Implement and manage CI/CD pipelines',
//             'Monitor system performance and implement optimizations',
//             'Ensure security best practices across all environments',
//             'Automate deployment and operational processes',
//             'Collaborate with development teams on infrastructure needs'
//         ],
//         benefits: [
//             'Excellent salary with stock options',
//             'Private healthcare and dental coverage',
//             'Hybrid working with office flexibility',
//             '25 days holiday plus your birthday off',
//             'AWS/Azure certification support and training budget',
//             'On-call compensation and time-off-in-lieu policy'
//         ],
//         experienceLevel: '5-8 years',
//         workingHours: '40 hours/week + on-call rotation',
//         salaryMin: 75000,
//         salaryMax: 100000,
//         currency: 'GBP',
//         skills: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'Docker', 'Python', 'CI/CD', 'Monitoring'],
//         department: 'Infrastructure',
//         education: "Bachelor's degree in Computer Science or equivalent experience",
//         applicationDeadline: '2024-03-01',
//         postedDate: '2024-01-20',
//         applicationsCount: 0,
//         createdAt: '2024-01-20T11:45:00Z',
//         updatedAt: '2024-01-20T11:45:00Z'
//     },
//     {
//         id: '5',
//         title: 'Marketing Specialist',
//         position: 'Digital Marketing Specialist',
//         company: 'GrowthCo',
//         location: 'Bristol, UK',
//         type: 'Part-time',
//         status: 'Active',
//         description: 'We are looking for a creative and data-driven Digital Marketing Specialist to join our marketing team. This part-time role is perfect for someone looking for work-life balance while working on exciting marketing campaigns across multiple channels.',
//         requirements: [
//             '2+ years of digital marketing experience',
//             'Experience with Google Ads, Facebook Ads, and LinkedIn advertising',
//             'Knowledge of SEO and content marketing strategies',
//             'Proficiency in marketing analytics tools (Google Analytics, HubSpot)',
//             'Strong writing and communication skills',
//             'Experience with email marketing platforms'
//         ],
//         responsibilities: [
//             'Plan and execute digital marketing campaigns',
//             'Manage social media accounts and content creation',
//             'Analyze campaign performance and optimize for ROI',
//             'Create engaging content for various marketing channels',
//             'Collaborate with sales team on lead generation strategies',
//             'Monitor industry trends and competitor activities'
//         ],
//         benefits: [
//             'Part-time salary with pro-rata benefits',
//             'Flexible working schedule (20 hours/week)',
//             'Professional development opportunities',
//             '15 days paid vacation (pro-rata)',
//             'Work-from-home allowance',
//             'Access to marketing tools and software'
//         ],
//         experienceLevel: '2-4 years',
//         workingHours: '20 hours/week',
//         salaryMin: 25000,
//         salaryMax: 35000,
//         currency: 'GBP',
//         skills: ['Google Ads', 'Facebook Ads', 'SEO', 'Content Marketing', 'Google Analytics', 'HubSpot', 'Email Marketing'],
//         department: 'Marketing',
//         education: "Bachelor's degree in Marketing, Communications, or related field",
//         applicationDeadline: '2024-02-10',
//         postedDate: '2024-01-12',
//         applicationsCount: 15,
//         createdAt: '2024-01-12T16:20:00Z',
//         updatedAt: '2024-01-12T16:20:00Z'
//     },
//     {
//         id: '6',
//         title: 'Data Analyst',
//         position: 'Contract Data Analyst',
//         company: 'DataInsights Ltd',
//         location: 'Birmingham, UK',
//         type: 'Contract',
//         status: 'Paused',
//         description: 'Join our analytics team as a Contract Data Analyst for a 6-month project analyzing customer behavior and market trends. This role involves working with large datasets to provide actionable insights that drive business decisions.',
//         requirements: [
//             '3+ years of data analysis experience',
//             'Advanced skills in SQL and data manipulation',
//             'Proficiency in Python or R for statistical analysis',
//             'Experience with data visualization tools (Tableau, Power BI)',
//             'Strong statistical analysis and modeling skills',
//             'Knowledge of machine learning concepts'
//         ],
//         responsibilities: [
//             'Analyze complex datasets to identify trends and patterns',
//             'Create dashboards and reports for stakeholders',
//             'Perform statistical analysis and build predictive models',
//             'Collaborate with business teams to understand data requirements',
//             'Clean and prepare data for analysis',
//             'Present findings and recommendations to senior management'
//         ],
//         benefits: [
//             'Competitive daily rate',
//             'Potential for contract extension',
//             'Flexible working arrangements',
//             'Access to cutting-edge analytics tools',
//             'Opportunity to work on high-impact projects',
//             'Professional development and networking opportunities'
//         ],
//         experienceLevel: '3-5 years',
//         workingHours: '40 hours/week',
//         salaryMin: 350,
//         salaryMax: 450,
//         currency: 'GBP/day',
//         skills: ['SQL', 'Python', 'R', 'Tableau', 'Power BI', 'Statistics', 'Machine Learning', 'Excel'],
//         department: 'Analytics',
//         education: "Bachelor's degree in Mathematics, Statistics, Computer Science, or related field",
//         applicationDeadline: '2024-02-28',
//         postedDate: '2024-01-05',
//         applicationsCount: 12,
//         createdAt: '2024-01-05T13:10:00Z',
//         updatedAt: '2024-01-18T09:30:00Z'
//     }
// ]; 