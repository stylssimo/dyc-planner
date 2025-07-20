import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, MapPin, Eye, Edit, List, Image } from 'lucide-react';
import { type TripTableRow } from './components/mockData';
import { db } from '../../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

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

// Helper function to parse price from string to number
const parsePrice = (priceString: string): number => {
  if (!priceString || priceString === 'TBD') return 0;
  
  // Remove currency symbols and parse
  const cleanPrice = priceString.replace(/[$,]/g, '');
  const parsed = parseFloat(cleanPrice);
  
  return isNaN(parsed) ? 0 : parsed;
};

// Helper function to format price for display
const formatPrice = (price: number): string => {
  if (price === 0) return 'TBD';
  return `$${price.toLocaleString()}`;
};

const AdminTrips = () => {
    const [tripsData, setTripsData] = useState<TripTableRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [continentFilter, setContinentFilter] = useState<string>('Continents');
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

    // Fetch trips from Firebase
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const tripsRef = collection(db, 'trips');
                const q = query(tripsRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                
                const trips: TripTableRow[] = [];
                
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    
                    // Transform Firebase data to match TripTableRow interface
                    const trip: TripTableRow = {
                        id: doc.id,
                        name: data.formData?.travelName || 'Untitled Trip',
                        status: 'Active', // Default status for new trips
                        country: data.formData?.country || 'Unknown',
                        continent: data.formData?.continent || 'Unknown',
                        duration: calculateDuration(data.formData?.startDate, data.formData?.endDate),
                        description: `${data.formData?.numberOfPeople || '1'} ${parseInt(data.formData?.numberOfPeople) === 1 ? 'person' : 'people'} • ${data.stops?.length || 0} stops`,
                        price: parsePrice(data.formData?.pricePoint),
                        bookedCount: 0, // Default for new trips
                        imageUrl: data.formData?.heroImage || data.days?.[0]?.activities?.[0]?.images?.[0] || '/trip_hero_image.webp', // Use hero image first, then activity image, then default
                        createdAt: data.createdAt
                    };
                    
                    trips.push(trip);
                });
                
                setTripsData(trips);
            } catch (err) {
                console.error('Error fetching trips:', err);
                setError('Failed to load trips. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

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
        return ['Continents', ...Array.from(new Set(continents))];
    }, [tripsData]);

    // Filter and search functionality
    const filteredData = useMemo(() => {
        return tripsData.filter(trip => {
            const matchesSearch = trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 trip.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 trip.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'All' || trip.status === statusFilter;
            const matchesContinent = continentFilter === 'Continents' || trip.continent === continentFilter;
            
            return matchesSearch && matchesStatus && matchesContinent;
        });
    }, [tripsData, searchTerm, statusFilter, continentFilter]);

    const handleCreateTrip = () => {
        window.open('/admin/trips/create', '_blank');
    };

	const handleViewTrip = (id: string) => {
		window.open(`/admin/trips/view/${id}`, '_blank');
	};

	const handleEditTrip = (id: string) => {
		window.open(`/admin/trips/edit/${id}`, '_blank');
	};

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading trips...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                <span>Create New Trip</span>
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
              {/* <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button> */}
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-4">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  {/* <option value="Draft">Draft</option> */}
                  {/* <option value="Archived">Archived</option> */}
                </select>
                <select 
                  value={continentFilter}
                  onChange={(e) => setContinentFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {uniqueContinents.map(continent => (
                    <option key={continent} value={continent}>{continent}</option>
                  ))}
                </select>
                {/* <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                </button> */}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-lg ${viewMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}>
                  <Image className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* No trips state */}
            {filteredData.length === 0 && !loading && (
                <div className="text-center py-12">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
                    <p className="text-gray-600 mb-6">
                        {tripsData.length === 0 
                            ? "Get started by creating your first trip itinerary." 
                            : "Try adjusting your search or filter criteria."
                        }
                    </p>
                    {tripsData.length === 0 && (
                        <button 
                            onClick={handleCreateTrip}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Your First Trip
                        </button>
                    )}
                </div>
            )}

            {/* Content based on view mode */}
            {filteredData.length > 0 && (
                <>
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
                                <div className="text-lg font-bold text-blue-600">{formatPrice(trip.price)}</div>
                                <div className="text-sm text-gray-500">{trip.bookedCount} bookings</div>
                              </div>
                              <div className="flex space-x-2 mt-4">
                                <button
									onClick={() => handleViewTrip(trip.id)}
									className="flex-1 text-blue-600 border border-blue-600 px-3 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors flex items-center justify-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </button>
                                <button
									onClick={() => handleEditTrip(trip.id)}
									className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center justify-center">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg shadow overflow-scroll">
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{formatPrice(trip.price)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.bookedCount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                  <button 
                                    onClick={() => handleViewTrip(trip.id)}
                                    className="text-blue-600 hover:text-blue-800">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleEditTrip(trip.id)}
                                    className="text-gray-600 hover:text-gray-800">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                </>
            )}

            {/* Results count */}
            {filteredData.length > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                  Showing {filteredData.length} of {tripsData.length} trips
                </div>
            )}
          </div>
        </div>
      );
};

export default AdminTrips;
