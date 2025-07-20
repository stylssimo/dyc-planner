import { useState } from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';

interface SearchBarProps {
  onSearch: (searchData: SearchData) => void;
}

interface SearchData {
  destination: string;
  checkIn?: string;
  checkOut?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      destination,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
    });
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        {/* Destination Input */}
        <div className="search-input-group">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Where to?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="search-input"
              required
            />
          </div>
        </div>

        {/* Desktop Divider */}
        <div className="search-divider"></div>

        {/* Date Inputs - Hidden on Mobile */}
        <div className="search-date-inputs">
          <div className="flex items-center space-x-2 md:space-x-3">
            <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 hidden md:block" />
            <input
              type="date"
              placeholder="Check in"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="search-date-input"
            />
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-3">
            <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 hidden md:block" />
            <input
              type="date"
              placeholder="Check out"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="search-date-input"
            />
          </div>
        </div>

        {/* Search Button */}
        <button type="submit" className="search-button">
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>
      </form>

      {/* Mobile Date Filter - Optional separate section */}
      <div className="md:hidden mt-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Check in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Check out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;