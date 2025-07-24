import { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Search, X, Tag } from 'lucide-react';
import { useTrips, type PublicTrip } from '../../../hooks/useTrips';
import HeroYouTube from '../../../components/HeroYoutube';
import { useCurrency } from '../../../contexts/CurrencyContext';

// Helper function to calculate duration from dates
const calculateDuration = (startDate: string, endDate: string): string => {
  if (!startDate || !endDate) return 'TBD';

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) return 'TBD';

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return '1 day';
  if (diffDays < 7) return `${diffDays} days`;

  const weeks = Math.floor(diffDays / 7);
  const remainingDays = diffDays % 7;
  
  let result = '';
  if (weeks === 1) result += '1 week';
  else if (weeks > 1) result += `${weeks} weeks`;
  
  if (remainingDays > 0) {
    if (result) result += ' ';
    result += remainingDays === 1 ? '1 day' : `${remainingDays} days`;
  }
  
  return result;
};

// Helper function to get trip type flare
const getTripFlare = (numberOfPeople: string) => {
  const count = parseInt(numberOfPeople);
  if (count === 1) return { text: 'Single', color: 'bg-purple-100 text-purple-800' };
  if (count === 2) return { text: 'Couple', color: 'bg-pink-100 text-pink-800' };
  return { text: 'Group', color: 'bg-blue-100 text-blue-800' };
};

const TripsPage = () => {
  const { trips, loading, error, searchTrips } = useTrips();
  const { formatPrice } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState('2 Adults');
  const [filteredTrips, setFilteredTrips] = useState<PublicTrip[]>([]);
  const [continentFilter, setContinentFilter] = useState('All Continents');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [tripType, setTripType] = useState('All');

  // Get URL search parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search') || '';
    const startParam = urlParams.get('startDate') || '';
    const endParam = urlParams.get('endDate') || '';
    const guestsParam = urlParams.get('guests') || '2 Adults';
    const typeParam = urlParams.get('type') || 'All';

    setSearchTerm(searchParam);
    setStartDate(startParam);
    setEndDate(endParam);
    setGuests(guestsParam);
    setTripType(typeParam);
  }, []);

  // Filter trips when search parameters or trips change
  useEffect(() => {
    if (!loading && trips.length > 0) {
      let filtered = searchTrips(searchTerm, startDate, endDate, guests);
      
      // Apply continent filter
      if (continentFilter !== 'All Continents') {
        filtered = filtered.filter(trip => trip.continent === continentFilter);
      }

      // Apply trip type filter
      if (tripType !== 'All') {
        filtered = filtered.filter(trip => {
          const count = parseInt(trip.description.split(' ')[0]);
          if (tripType === 'Single' && count === 1) return true;
          if (tripType === 'Couple' && count === 2) return true;
          if (tripType === 'Group' && count > 2) return true;
          return false;
        });
      }

      // Apply price filter
      filtered = filtered.filter(trip => {
        const price = parseFloat(trip.price.replace(/[^0-9.]/g, ''));
        return !isNaN(price) && price >= priceRange[0] && price <= priceRange[1];
      });
      
      setFilteredTrips(filtered);
    }
  }, [trips, searchTerm, startDate, endDate, guests, continentFilter, tripType, priceRange, loading]);

  // Get unique continents for filter
  const uniqueContinents = ['All Continents', ...Array.from(new Set(trips.map(trip => trip.continent)))];

  const handleSearch = () => {
    const filtered = searchTrips(searchTerm, startDate, endDate, guests);
    setFilteredTrips(filtered);
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
              {/* Mobile Search Fields */}
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
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={continentFilter}
              onChange={(e) => setContinentFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {uniqueContinents.map(continent => (
                <option key={continent} value={continent}>{continent}</option>
              ))}
            </select>

            <select 
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Single">Single</option>
              <option value="Couple">Couple</option>
              <option value="Group">Group</option>
            </select>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Price Range:</span>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="w-24"
              />
              <span className="text-sm text-gray-600">-</span>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-24"
              />
              <span className="text-sm text-gray-600">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </span>
            </div>
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
              <div key={trip.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="relative">
                  {trip.videoUrl ? (
                    <div className="w-full h-48">
                      <HeroYouTube
                        className="w-full h-48 object-cover"
                        videoUrl={trip.videoUrl}
                        mute={true}
                        autoPlay={false}
                      />
                    </div>
                  ) : (
                    <img 
                      src={trip.imageUrl} 
                      alt={trip.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/trip_hero_image.webp';
                      }}
                    />
                  )}
                  {/* Trip Type Badge */}
                  <div className="absolute bottom-2 left-2">
                    <div className={`${getTripFlare(trip.numberOfPeople).color} px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1`}>
                      <Users className="w-3 h-3" />
                      <span>{getTripFlare(trip.numberOfPeople).text}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold truncate">{trip.name}</h3>
                  </div>

                  {/* Location Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      <MapPin className="w-3 h-3 mr-1" />
                      {trip.continent}
                    </div>
                    <div className="flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      <Tag className="w-3 h-3 mr-1" />
                      {trip.country}
                    </div>
                  </div>

                  {/* Duration */}
                  {trip.startDate && trip.endDate && (
                    <p className="text-gray-600 text-sm mb-3">
                      {calculateDuration(trip.startDate, trip.endDate)}
                    </p>
                  )}

                  {/* Trip Tags */}
                  {trip.tripTags && trip.tripTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {trip.tripTags.map((tag, index) => (
                        <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{trip.description}</p>

                  {/* Price and Button - This will stay at the bottom */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="text-left">
                      <p className="text-2xl font-bold text-gray-900">{trip.currency + '' + formatPrice(parseFloat(trip.price))}</p>
                    </div>
                    <button 
                      onClick={() => window.open(`/trip/${trip.id}`, '_blank')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Book Consultation
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
