import { useState } from 'react';
import { Users, Target, Award, Globe, ArrowRight, Star } from 'lucide-react';
import Footer from '../../../components/Footer';

const AboutUs = () => {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading
    useState(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    });



    const stats = [
        { number: "500+", label: "Happy Clients" },
        { number: "50+", label: "Team Members" },
        { number: "100+", label: "Projects Completed" },
        { number: "5", label: "Years of Excellence" }
    ];

    const values = [
        {
            icon: <Target className="w-8 h-8" />,
            title: "Innovation",
            description: "We constantly push boundaries to deliver cutting-edge solutions that exceed expectations."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Collaboration",
            description: "We believe in the power of teamwork and building strong partnerships with our clients."
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: "Excellence",
            description: "We maintain the highest standards of quality in everything we do."
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: "Global Impact",
            description: "Our solutions make a positive difference in communities worldwide."
        }
    ];

    if (isLoading) {
        return (
            <div className="inset-0 bg-blue-500">
                <div className="absolute inset-0 flex items-center justify-center bg-blue-500">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-white mb-4 mx-auto"></div>
                        <p className="text-white text-lg">Loading our story...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="inset-0 bg-blue-500 overflow-y-auto">
            <div className="min-h-full">
                {/* Hero Section */}
                <div className="flex items-center justify-center min-h-screen px-8">
                    <div className="text-center max-w-4xl">
                        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight">
                            About Us
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
                            We are a passionate team dedicated to creating innovative solutions 
                            that transform businesses and inspire communities worldwide.
                        </p>
                        <div className="flex flex-wrap justify-center gap-8 text-white">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                                    <div className="text-gray-400 text-sm uppercase tracking-wide">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mission Section */}
                <div className="flex items-center justify-center min-h-screen px-8 border-t border-gray-800">
                    <div className="max-w-6xl w-full">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                                    Our Mission
                                </h2>
                                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                    To empower businesses and individuals through innovative technology solutions 
                                    that simplify complex challenges and create meaningful impact in the digital world.
                                </p>
                                <div className="flex items-center text-white hover:text-gray-300 transition-colors cursor-pointer">
                                    <span className="text-lg mr-3">Learn more about our journey</span>
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {values.map((value, index) => (
                                    <div key={index} className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
                                        <div className="text-white mb-4">
                                            {value.icon}
                                        </div>
                                        <h3 className="text-white font-bold mb-3">{value.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Section - Now Brochure */}
                <div className="flex items-center justify-center min-h-screen px-8 border-t border-gray-800">
                    <div className="max-w-7xl w-full text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Our Brochure
                        </h2>
                        <p className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto">
                            Learn more about our company, services, and team through our detailed brochure.
                        </p>
                        
                        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
                            <div className="w-full lg:w-1/2 max-w-md">
                                <img
                                    src="/Brochure_page1.jpg"
                                    alt="Brochure Page 1"
                                    className="w-full h-auto object-contain rounded-lg shadow-2xl border border-gray-700 hover:border-gray-500 transition-colors duration-300"
                                    onError={(e) => {
                                        e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjU2NSIgdmlld0JveD0iMCAwIDQwMCA1NjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNTY1IiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjgyIiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+QnJvY2h1cmUgUGFnZSAxPC90ZXh0Pgo8L3N2Zz4K";
                                    }}
                                />
                            </div>
                            <div className="w-full lg:w-1/2 max-w-md">
                                <img
                                    src="/Brochure_page2.jpg"
                                    alt="Brochure Page 2"
                                    className="w-full h-auto object-contain rounded-lg shadow-2xl border border-gray-700 hover:border-gray-500 transition-colors duration-300"
                                    onError={(e) => {
                                        e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjU2NSIgdmlld0JveD0iMCAwIDQwMCA1NjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNTY1IiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjgyIiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+QnJvY2h1cmUgUGFnZSAyPC90ZXh0Pgo8L3N2Zz4K";
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact CTA Section */}
                <div className="flex items-center justify-center min-h-screen px-8 border-t border-gray-800">
                    <div className="text-center max-w-4xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                            Ready to Work Together?
                        </h2>
                        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                            Let's create something amazing together. We're here to turn your vision into reality.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                                Get Started
                            </button>
                            <button className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors">
                                Contact Us
                            </button>
                        </div>
                        
                        <div className="flex justify-center items-center mt-16 space-x-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                            ))}
                            <span className="text-gray-300 ml-4">Trusted by industry leaders</span>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default AboutUs;