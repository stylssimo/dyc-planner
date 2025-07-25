import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react';
import Footer from '../../../components/Footer';

const FAQ = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState('all');

    // Simulate loading
    useState(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    });

    const categories = [
        { id: 'all', name: 'All Questions', count: 12 },
        { id: 'general', name: 'General', count: 4 },
        { id: 'technical', name: 'Technical', count: 3 },
        { id: 'billing', name: 'Billing', count: 3 },
        { id: 'support', name: 'Support', count: 2 }
    ];

    const faqs = [
        {
            id: 1,
            category: 'general',
            question: "What is your company about?",
            answer: "We are a technology company focused on creating innovative solutions that help businesses transform their operations and achieve their goals. Our team combines expertise in software development, design, and strategy to deliver exceptional results."
        },
        {
            id: 2,
            category: 'general',
            question: "How long have you been in business?",
            answer: "We have been serving clients for over 5 years, during which we've completed 100+ projects and built lasting relationships with 500+ satisfied customers worldwide."
        },
        {
            id: 3,
            category: 'general',
            question: "What industries do you work with?",
            answer: "We work across various industries including healthcare, finance, e-commerce, education, and manufacturing. Our flexible approach allows us to adapt our solutions to meet the unique needs of different sectors."
        },
        {
            id: 4,
            category: 'general',
            question: "Where are you located?",
            answer: "Our headquarters is located in the heart of the tech district, but we work with clients globally. We have team members distributed across different time zones to provide 24/7 support."
        },
        {
            id: 5,
            category: 'technical',
            question: "What technologies do you use?",
            answer: "We use cutting-edge technologies including React, Node.js, Python, AWS, Docker, and modern CI/CD practices. We stay updated with the latest trends and choose the best technology stack for each project."
        },
        {
            id: 6,
            category: 'technical',
            question: "Do you provide mobile app development?",
            answer: "Yes, we develop both native and cross-platform mobile applications for iOS and Android. We use React Native, Flutter, and native development depending on project requirements."
        },
        {
            id: 7,
            category: 'technical',
            question: "Can you integrate with existing systems?",
            answer: "Absolutely! We specialize in system integration and can work with your existing infrastructure. We have experience with various APIs, databases, and legacy systems."
        },
        {
            id: 8,
            category: 'billing',
            question: "What are your pricing models?",
            answer: "We offer flexible pricing models including fixed-price projects, hourly rates, and retainer agreements. Pricing depends on project scope, complexity, and timeline. Contact us for a custom quote."
        },
        {
            id: 9,
            category: 'billing',
            question: "Do you offer payment plans?",
            answer: "Yes, we understand that different businesses have different cash flow needs. We offer milestone-based payments and can discuss custom payment schedules that work for your budget."
        },
        {
            id: 10,
            category: 'billing',
            question: "What payment methods do you accept?",
            answer: "We accept various payment methods including bank transfers, credit cards, PayPal, and cryptocurrency. We'll work with you to find the most convenient payment method."
        },
        {
            id: 11,
            category: 'support',
            question: "What kind of support do you provide?",
            answer: "We provide comprehensive support including technical assistance, maintenance, updates, and training. Our support team is available during business hours with emergency support available 24/7."
        },
        {
            id: 12,
            category: 'support',
            question: "How quickly do you respond to support requests?",
            answer: "We aim to respond to all support requests within 2 hours during business hours. Critical issues receive immediate attention, and we provide regular updates throughout the resolution process."
        }
    ];

    const filteredFAQs = faqs.filter(faq => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleFAQ = (id: number | null) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    if (isLoading) {
        return (
            <div className="inset-0 bg-blue-500">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-white mb-4 mx-auto"></div>
                        <p className="text-white text-lg">Loading frequently asked questions...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="inset-0 bg-blue-500 overflow-y-auto pt-20">
            <div className="min-h-full">
                {/* Hero Section */}
                <div className="flex items-center justify-center px-8">
                    <div className="text-center max-w-4xl w-full">
                        <HelpCircle className="w-16 h-16 text-white mx-auto mb-8" />
                        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight">
                            FAQ
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
                            Find answers to commonly asked questions about our services, 
                            processes, and how we can help your business grow.
                        </p>
                        
                        {/* Search Bar */}
                        {/* <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                            />
                        </div> */}
                    </div>
                </div>

                {/* Categories and FAQ Section */}
                <div className="flex items-start justify-center min-h-screen px-8 border-t border-blue-400/30">
                    <div className="max-w-6xl w-full py-16">
                        {/* Categories */}
                        <div className="flex flex-wrap justify-center gap-4 mb-16">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                                        activeCategory === category.id
                                            ? 'bg-white text-blue-500 shadow-lg'
                                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                                    }`}
                                >
                                    {category.name}
                                    <span className="ml-2 text-sm opacity-75">({category.count})</span>
                                </button>
                            ))}
                        </div>

                        {/* FAQ List */}
                        <div className="space-y-4">
                            {filteredFAQs.length > 0 ? (
                                filteredFAQs.map((faq) => (
                                    <div key={faq.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleFAQ(faq.id)}
                                            className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                                        >
                                            <h3 className="text-lg font-semibold text-white pr-4">
                                                {faq.question}
                                            </h3>
                                            {openFAQ === faq.id ? (
                                                <ChevronUp className="w-5 h-5 text-white flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-white flex-shrink-0" />
                                            )}
                                        </button>
                                        {openFAQ === faq.id && (
                                            <div className="px-6 pb-6">
                                                <div className="border-t border-white/20 pt-4">
                                                    <p className="text-blue-100 leading-relaxed">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16">
                                    <HelpCircle className="w-16 h-16 text-blue-200 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">No FAQs found</h3>
                                    <p className="text-blue-200">Try adjusting your search or category filter.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Support Section */}
                <div className="flex items-center justify-center px-8 border-t border-blue-400/30">
                    <div className="text-center max-w-4xl">
                        <MessageCircle className="w-16 h-16 text-white mx-auto mb-8" />
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                            Still Have Questions?
                        </h2>
                        <p className="text-xl text-blue-100 mb-12 leading-relaxed">
                            Can't find what you're looking for? Our support team is here to help you 
                            with any questions or concerns you might have.
                        </p>
                        
                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                                <Mail className="w-8 h-8 text-white mx-auto mb-4" />
                                <h3 className="font-semibold text-white mb-2">Email Support</h3>
                                <p className="text-blue-200 text-sm mb-4">Get detailed help via email</p>
                                <p className="text-white font-medium">support@company.com</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                                <Phone className="w-8 h-8 text-white mx-auto mb-4" />
                                <h3 className="font-semibold text-white mb-2">Phone Support</h3>
                                <p className="text-blue-200 text-sm mb-4">Speak directly with our team</p>
                                <p className="text-white font-medium">+1 (555) 123-4567</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                                <MessageCircle className="w-8 h-8 text-white mx-auto mb-4" />
                                <h3 className="font-semibold text-white mb-2">Live Chat</h3>
                                <p className="text-blue-200 text-sm mb-4">Instant help when you need it</p>
                                <p className="text-white font-medium">Available 24/7</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button className="bg-white text-blue-500 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                                Contact Support
                            </button>
                            <button className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-500 transition-colors">
                                Submit a Ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FAQ;