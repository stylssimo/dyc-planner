import { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Search, Star, Wifi, Car, X } from 'lucide-react';
import { useTrips, type PublicTrip } from '../../../hooks/useTrips';

const TripsPage = () => {
  const { trips, loading, error, searchTrips } = useTrips();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState('2 Adults');
  const [filteredTrips, setFilteredTrips] = useState<PublicTrip[]>([]);
  const [continentFilter, setContinentFilter] = useState('All Continents');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  // Get URL search parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search') || '';
    const startParam = urlParams.get('startDate') || '';
    const endParam = urlParams.get('endDate') || '';
    const guestsParam = urlParams.get('guests') || '2 Adults';

    setSearchTerm(searchParam);
    setStartDate(startParam);
    setEndDate(endParam);
    setGuests(guestsParam);
  }, []);

  // Filter trips when search parameters or trips change
  useEffect(() => {
    if (!loading && trips.length > 0) {
      let filtered = searchTrips(searchTerm, startDate, endDate, guests);
      
      // Apply continent filter
      if (continentFilter !== 'All Continents') {
        filtered = filtered.filter(trip => trip.continent === continentFilter);
      }
      
      setFilteredTrips(filtered);
    }
  }, [trips, searchTerm, startDate, endDate, guests, continentFilter, loading]);

  // Get unique continents for filter
  const uniqueContinents = ['All Continents', ...Array.from(new Set(trips.map(trip => trip.continent)))];

  const handleSearch = () => {
    const filtered = searchTrips(searchTerm, startDate, endDate, guests);
    setFilteredTrips(filtered);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Finding amazing trips for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Available Trips</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {filteredTrips.length} trip{filteredTrips.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="space-y-4 mt-3 md:hidden">
              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search destinations, countries..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="outline-none bg-transparent text-sm flex-1"
                  />
                </div>
              </div>

              {/* Check-in Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="outline-none bg-transparent text-sm flex-1"
                  />
                </div>
              </div>

              {/* Check-out Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="outline-none bg-transparent text-sm flex-1"
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="outline-none bg-transparent text-sm flex-1"
                  >
                    <option value="1 Adult">1 Adult</option>
                    <option value="2 Adults">2 Adults</option>
                    <option value="3 Adults">3 Adults</option>
                    <option value="4 Adults">4 Adults</option>
                    <option value="Family (2+2)">Family (2+2)</option>
                  </select>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Desktop Search Bar */}
      <div className="hidden md:block bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 flex items-center space-x-2 lg:space-x-4 bg-gray-50 rounded-lg p-3 lg:p-4">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search destinations..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="outline-none bg-transparent text-sm flex-1 min-w-0"
                />
              </div>
              <div className="h-6 w-px bg-gray-300 hidden lg:block"></div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="outline-none bg-transparent text-sm w-auto"
                />
              </div>
              <div className="h-6 w-px bg-gray-300 hidden lg:block"></div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="outline-none bg-transparent text-sm w-auto"
                />
              </div>
              <div className="h-6 w-px bg-gray-300 hidden lg:block"></div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <select 
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="outline-none bg-transparent text-sm"
                >
                  <option value="1 Adult">1 Adult</option>
                  <option value="2 Adults">2 Adults</option>
                  <option value="3 Adults">3 Adults</option>
                  <option value="4 Adults">4 Adults</option>
                  <option value="Family (2+2)">Family (2+2)</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 lg:px-6 py-3 lg:py-4 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Search Trips</h2>
              <button 
                onClick={() => setShowMobileSearch(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search Button */}
            <button 
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 mt-6"
            >
              <Search className="w-5 h-5" />
              <span>Search Trips</span>
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <select 
              value={continentFilter}
              onChange={(e) => setContinentFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-none"
            >
              {uniqueContinents.map(continent => (
                <option key={continent} value={continent}>{continent}</option>
              ))}
            </select>
            {/* <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button> */}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600 px-4">Try adjusting your search criteria or browse all available trips.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={trip.imageUrl} 
                    alt={trip.name}
                    className="w-full h-40 sm:h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/trip_hero_image.webp';
                    }}
                  />
                </div>
                <div className="p-3 sm:p-4">
                  {/* Title and Rating */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 text-sm sm:text-base">{trip.name}</h3>
                    <div className="flex items-center space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" 
                        />
                      ))}
                      <span className="text-xs sm:text-sm text-gray-600 ml-1">(2,578 Reviews)</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <p className="text-gray-600 text-xs sm:text-sm mb-3">{trip.duration}</p>

                  {/* Amenities - Responsive layout */}
                  <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs">Resort</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs">Pool</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Car className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs">Key card</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs">Free wifi</span>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-left">
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatPrice(trip.price)}</p>
                    </div>
                    <button 
                      onClick={() => window.open(`/trip/${trip.id}`, '_blank')}
                      className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsPage;
