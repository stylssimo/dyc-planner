import React, { useState, useMemo } from 'react';
import { Search, Plus, Users, MapPin, Calendar, DollarSign, Filter, MoreHorizontal, Eye, Edit } from 'lucide-react';
import { mockTripData, type TripTableRow } from './components/mockData';
import { useNavigate } from 'react-router-dom';

const AdminTrips = () => {
    const navigate = useNavigate();
    const [tripsData, setTripsData] = useState<TripTableRow[]>(mockTripData);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [continentFilter, setContinentFilter] = useState<string>('All Continents');
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

    const getStatusColor = (status: TripTableRow['status']) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Draft': return 'bg-yellow-100 text-yellow-800';
            case 'Archived': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get unique continents for filter dropdown
    const uniqueContinents = useMemo(() => {
        const continents = tripsData.map(item => item.continent);
        return ['All Continents', ...Array.from(new Set(continents))];
    }, [tripsData]);

    // Filter and search functionality
    const filteredData = useMemo(() => {
        return tripsData.filter(trip => {
            const matchesSearch = trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 trip.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 trip.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'All' || trip.status === statusFilter;
            const matchesContinent = continentFilter === 'All Continents' || trip.continent === continentFilter;
            
            return matchesSearch && matchesStatus && matchesContinent;
        });
    }, [tripsData, searchTerm, statusFilter, continentFilter]);

    const handleCreateTrip = () => {
        window.open('/createTrip', '_blank');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-4xl font-bold">{filteredData.length}</div>
                  <div className="text-gray-500">Trips</div>
                </div>
                <div className="h-16 w-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold">{filteredData.filter(t => t.status === 'Active').length}</div>
                  <div className="text-gray-500">Active</div>
                </div>
              </div>
              <button 
                onClick={handleCreateTrip}
                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create New Itinerary</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search trips by name, country, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-4">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
                <select 
                  value={continentFilter}
                  onChange={(e) => setContinentFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {uniqueContinents.map(continent => (
                    <option key={continent} value={continent}>{continent}</option>
                  ))}
                </select>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-lg ${viewMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}>
                  <MapPin className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}>
                  <Users className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content based on view mode */}
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((trip) => (
                  <div key={trip.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <img src={trip.imageUrl} alt={trip.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold truncate">{trip.name}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(trip.status)}`}>
                          {trip.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{trip.country} • {trip.duration}</p>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trip.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-blue-600">${trip.price}</div>
                        <div className="text-sm text-gray-500">{trip.bookedCount} bookings</div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <button className="flex-1 text-blue-600 border border-blue-600 px-3 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors flex items-center justify-center">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center justify-center">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((trip) => (
                      <tr key={trip.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-10 w-10 rounded object-cover" src={trip.imageUrl} alt="" />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{trip.name}</div>
                              <div className="text-sm text-gray-500">{trip.description.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(trip.status)}`}>
                            {trip.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.country}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">${trip.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.bookedCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredData.length} of {tripsData.length} trips
            </div>
          </div>
        </div>
      );
};

export default AdminTrips;
