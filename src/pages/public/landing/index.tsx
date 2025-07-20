import { useState } from "react";
import { Calendar, Users, MapPin, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useTrips } from '../../../hooks/useTrips';

const Landing = () => {
    // Search form state
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [guests, setGuests] = useState('2 Adults');

    // Carousel state
    const [currentIndex, setCurrentIndex] = useState(0);

    // Get real trip data
    const { trips, loading, error } = useTrips();

    const handleSearch = () => {
        // Build search parameters
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.append('search', searchTerm.trim());
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (guests) params.append('guests', guests);

        // Open trips page in new window with search parameters
        const url = `/trips${params.toString() ? '?' + params.toString() : ''}`;
        window.open(url, '_blank');
    };

    // Responsive carousel navigation - different items per page based on screen size
    const getItemsPerPage = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 1024) return 4; // lg
            if (window.innerWidth >= 768) return 2;  // md
            return 1; // sm
        }
        return 4;
    };

    const itemsPerPage = getItemsPerPage();
    const maxIndex = Math.max(0, trips.length - itemsPerPage);

    const nextSlide = () => {
        setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    };

    const prevSlide = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    // Get visible trips for carousel
    const visibleTrips = trips.slice(currentIndex, currentIndex + itemsPerPage);

    const formatPrice = (price: string): string => {
        if (!price || price === 'TBD') return 'TBD';
        
        // If it already has currency symbol, return as is
        if (price.includes('$')) return price;
        
        // Try to parse and format as currency
        const numPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
        if (!isNaN(numPrice)) {
            return `$${numPrice.toLocaleString()}`;
        }
        
        return price;
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-screen bg-cover bg-center overflow-hidden" 
                     style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop')" }}>
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 max-w-4xl">
                        The whole world awaits.
                    </h1>
                    
                    {/* Mobile-First Search Bar */}
                    <div className="w-full max-w-6xl mx-auto">
                        {/* Desktop Search Bar */}
                        <div className="hidden lg:flex backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-6 items-center space-x-4 mt-8">
                            <div className="flex items-center space-x-2 text-white">
                                <MapPin className="w-5 h-5 text-white" />
                                <input 
                                    type="text" 
                                    placeholder="Search destinations, countries" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="outline-none text-sm w-60 bg-transparent placeholder-white/80 text-white"
                                />
                            </div>
                            <div className="h-6 w-px bg-white/30"></div>
                            <div className="flex items-center space-x-2 text-white">
                                <Calendar className="w-5 h-5 text-white" />
                                <input 
                                    type="date" 
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    placeholder="Start Date"
                                    className="outline-none text-sm bg-transparent text-white placeholder-white/80"
                                />
                            </div>
                            <div className="h-6 w-px bg-white/30"></div>
                            <div className="flex items-center space-x-2 text-white">
                                <Calendar className="w-5 h-5 text-white" />
                                <input 
                                    type="date" 
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    placeholder="End Date"
                                    className="outline-none text-sm bg-transparent text-white placeholder-white/80"
                                />
                            </div>
                            <div className="h-6 w-px bg-white/30"></div>
                            <div className="flex items-center space-x-2 text-white">
                                <Users className="w-5 h-5 text-white" />
                                <select 
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                    className="outline-none text-sm bg-transparent text-white"
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: 'white'
                                    }}
                                >
                                    <option value="1 Adult" className="text-gray-900">1 Adult</option>
                                    <option value="2 Adults" className="text-gray-900">2 Adults</option>
                                    <option value="3 Adults" className="text-gray-900">3 Adults</option>
                                    <option value="4 Adults" className="text-gray-900">4 Adults</option>
                                    <option value="Family (2+2)" className="text-gray-900">Family (2+2)</option>
                                </select>
                            </div>
                            <button 
                                onClick={handleSearch}
                                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-all flex items-center space-x-2"
                            >
                                <Search className="w-4 h-4" />
                                <span>Search</span>
                            </button>
                        </div>

                        {/* Mobile/Tablet Search Bar */}
                        <div className="lg:hidden backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-4 mt-8 mx-4">
                            <div className="space-y-4">
                                {/* Search Input */}
                                <div className="flex items-center space-x-2 text-white">
                                    <MapPin className="w-5 h-5 text-white flex-shrink-0" />
                                    <input 
                                        type="text" 
                                        placeholder="Search destinations" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="outline-none text-sm w-full bg-transparent placeholder-white/80 text-white"
                                    />
                                </div>
                                
                                {/* Date Inputs */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2 text-white">
                                        <Calendar className="w-5 h-5 text-white flex-shrink-0" />
                                        <input 
                                            type="date" 
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="outline-none text-sm bg-transparent text-white placeholder-white/80 w-full"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2 text-white">
                                        <Calendar className="w-5 h-5 text-white flex-shrink-0" />
                                        <input 
                                            type="date" 
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="outline-none text-sm bg-transparent text-white placeholder-white/80 w-full"
                                        />
                                    </div>
                                </div>

                                {/* Guests and Search */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center space-x-2 text-white flex-1">
                                        <Users className="w-5 h-5 text-white flex-shrink-0" />
                                        <select 
                                            value={guests}
                                            onChange={(e) => setGuests(e.target.value)}
                                            className="outline-none text-sm bg-transparent text-white w-full"
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: 'white'
                                            }}
                                        >
                                            <option value="1 Adult" className="text-gray-900">1 Adult</option>
                                            <option value="2 Adults" className="text-gray-900">2 Adults</option>
                                            <option value="3 Adults" className="text-gray-900">3 Adults</option>
                                            <option value="4 Adults" className="text-gray-900">4 Adults</option>
                                            <option value="Family (2+2)" className="text-gray-900">Family (2+2)</option>
                                        </select>
                                    </div>
                                    <button 
                                        onClick={handleSearch}
                                        className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-all flex items-center justify-center space-x-2 sm:flex-shrink-0"
                                    >
                                        <Search className="w-4 h-4" />
                                        <span>Search</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tour Packages Section */}
            <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 lg:mb-12">
                    <div className="mb-6 lg:mb-0">
                        <p className="text-blue-600 font-semibold uppercase tracking-wide mb-2 text-sm sm:text-base">TOUR PACKAGES</p>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                            The amazing places around<br className="hidden sm:block" />
                            <span className="sm:hidden"> </span>the world
                        </h2>
                    </div>
                    <div className="flex items-center justify-between lg:justify-end lg:space-x-4">
                        <button 
                            onClick={() => window.open('/trips', '_blank')}
                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                        >
                            See all
                        </button>
                        <div className="flex space-x-2">
                            <button 
                                onClick={prevSlide}
                                disabled={currentIndex === 0}
                                className={`p-2 border border-gray-300 rounded-full transition-colors ${
                                    currentIndex === 0 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'hover:bg-gray-100 text-gray-600'
                                }`}
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button 
                                onClick={nextSlide}
                                disabled={currentIndex >= maxIndex}
                                className={`p-2 border border-gray-300 rounded-full transition-colors ${
                                    currentIndex >= maxIndex 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'hover:bg-gray-100 text-gray-600'
                                }`}
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading amazing trips...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center px-4">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : visibleTrips.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No trips available at the moment.</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative overflow-hidden">
                        {/* Mobile: Stack cards vertically */}
                        <div className="block md:hidden space-y-6">
                            {visibleTrips.map((trip) => (
                                <div 
                                    key={trip.id}
                                    onClick={() => window.open(`/trip/${trip.id}`, '_blank')}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                                >
                                    <img 
                                        src={trip.imageUrl} 
                                        alt={trip.name}
                                        className="w-full h-48 sm:h-56 object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/trip_hero_image.webp';
                                        }}
                                    />
                                    <div className="p-4 sm:p-6">
                                        <h3 className="font-semibold text-gray-800 mb-2 text-lg sm:text-xl line-clamp-2">{trip.name}</h3>
                                        <p className="text-gray-600 text-sm sm:text-base mb-2">{trip.location}</p>
                                        <p className="text-gray-500 text-sm mb-4">{trip.duration}</p>
                                        <p className="text-xl sm:text-2xl font-bold text-blue-600">{formatPrice(trip.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop/Tablet: Horizontal carousel */}
                        <div className="hidden lg:block">
                            <div 
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                            >
                                {trips.map((trip) => (
                                    <div 
                                        key={trip.id} 
                                        className="w-1/4 flex-shrink-0 px-3"
                                    >
                                        <div 
                                            onClick={() => window.open(`/trip/${trip.id}`, '_blank')}
                                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                                        >
                                            <img 
                                                src={trip.imageUrl} 
                                                alt={trip.name}
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/trip_hero_image.webp';
                                                }}
                                            />
                                            <div className="p-6">
                                                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{trip.name}</h3>
                                                <p className="text-gray-600 text-sm mb-4">{trip.location}</p>
                                                <p className="text-gray-500 text-sm mb-4">{trip.duration}</p>
                                                <p className="text-2xl font-bold text-blue-600">{formatPrice(trip.price)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Medium screens: 2-column grid */}
                        <div className="hidden md:block lg:hidden">
                            <div className="grid grid-cols-2 gap-6">
                                {visibleTrips.map((trip) => (
                                    <div 
                                        key={trip.id}
                                        onClick={() => window.open(`/trip/${trip.id}`, '_blank')}
                                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                                    >
                                        <img 
                                            src={trip.imageUrl} 
                                            alt={trip.name}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/trip_hero_image.webp';
                                            }}
                                        />
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-800 mb-2 text-lg line-clamp-2">{trip.name}</h3>
                                            <p className="text-gray-600 text-sm mb-2">{trip.location}</p>
                                            <p className="text-gray-500 text-sm mb-4">{trip.duration}</p>
                                            <p className="text-xl font-bold text-blue-600">{formatPrice(trip.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Plan your trip section */}
            <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="relative rounded-2xl overflow-hidden">
                    <img 
                        src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=400&fit=crop"
                        alt="Travel planning"
                        className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-start p-6 sm:p-8 lg:p-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                            Plan your trip with travel<br className="hidden sm:block" />
                            <span className="sm:hidden"> </span>expert
                        </h2>
                        <p className="text-base sm:text-lg lg:text-xl text-white mb-8 max-w-2xl">
                            Our professional advisors can craft your perfect itinerary
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 mb-8">
                        <div className="sm:col-span-2 lg:col-span-1">
                            <h3 className="text-2xl font-bold mb-4">DYC</h3>
                        </div>
                        {/* <div>
                            <h4 className="font-semibold mb-4">Destinations via Air Travel</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>Dritto Market</li>
                                <li>Seo List</li>
                            </ul>
                        </div> */}
                    </div>
                    
                    <div className="border-t border-gray-700 pt-6 lg:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* <div className="flex items-center space-x-4">
                            <select className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm">
                                <option>Internet USD</option>
                            </select>
                        </div> */}
                        <div className="flex space-x-4">
                            <span className="w-6 h-6 bg-blue-600 rounded"></span>
                            <span className="w-6 h-6 bg-blue-400 rounded"></span>
                            <span className="w-6 h-6 bg-gray-600 rounded"></span>
                            <span className="w-6 h-6 bg-red-600 rounded"></span>
                        </div>
                    </div>
                    
                    <div className="text-center text-sm text-gray-400 mt-6 lg:mt-8">
                        © 2025 DYC. All rights reserved
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Landing;