import React, { useState, useMemo } from 'react';
import { Search, Users, Filter, MoreHorizontal, X } from 'lucide-react';
import { mockTableData, type TableRow } from './components/mockData';

interface InviteFormData {
  title: string;
  name: string;
  note: string;
  date: string;
  time: string;
}

const TravelDashboard = () => {
  const [consultationsData] = useState<TableRow[]>(mockTableData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [tripFilter, setTripFilter] = useState<string>('All Trips');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState<InviteFormData>({
    title: '',
    name: '',
    note: '',
    date: '',
    time: ''
  });

  const getStatusColor = (status: TableRow['status']) => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-800';
        case 'Consulted': return 'bg-green-500 text-white';
        case 'Cancelled': return 'bg-gray-300 text-gray-600';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unique trips for filter dropdown
  const uniqueTrips = useMemo(() => {
    const trips = consultationsData.map(item => item.trip);
    return ['All Trips', ...Array.from(new Set(trips))];
  }, [consultationsData]);

  // Filter and search functionality
  const filteredData = useMemo(() => {
    return consultationsData.filter(item => {
      const matchesSearch = item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.trip.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.phoneNumber.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesTrip = tripFilter === 'All Trips' || item.trip === tripFilter;
      
      return matchesSearch && matchesStatus && matchesTrip;
    });
  }, [consultationsData, searchTerm, statusFilter, tripFilter]);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Invite submitted:', inviteForm);
    // Here you would typically send the data to your backend
    setIsInviteModalOpen(false);
    setInviteForm({ title: '', name: '', note: '', date: '', time: '' });
  };

  const handleInputChange = (field: keyof InviteFormData, value: string) => {
    setInviteForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-8">
                <div className="text-center">
                    <div className="text-4xl font-bold">12</div>
                    <div className="text-gray-500">People</div>
                </div>
                <div className="h-16 w-px bg-gray-300"></div>
                <div className="text-center">
                    <div className="text-4xl font-bold">5</div>
                    <div className="text-gray-500">Trips</div>
                </div>
                </div>
                <button 
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Invite</span>
                </button>
            </div>

        {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name, trip, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            <div className="flex space-x-4 mb-6">
                <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Consulted">Consulted</option>
                <option value="Cancelled">Cancelled</option>
                </select>
                <select 
                value={tripFilter}
                onChange={(e) => setTripFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {uniqueTrips.map(trip => (
                    <option key={trip} value={trip}>{trip}</option>
                ))}
                </select>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                </button>
            </div>

        {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input type="checkbox" className="mr-2" />
                            User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consult. Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <input type="checkbox" className="mr-3" />
                                <div className="flex items-center">
                                <img className="h-8 w-8 rounded-full" src={row.avatar} alt="" />
                                <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{row.user}</div>
                                </div>
                                </div>
                            </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.status)}`}>
                                {row.status}
                            </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.phoneNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.trip}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tripId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.consultDate}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-500">
                Showing {filteredData.length} of {consultationsData.length} consultations
            </div>
        </div>

        {/* Invite Modal */}
        {isInviteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 animate-slideUp">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Send Invitation</h2>
                        <button
                            onClick={() => setIsInviteModalOpen(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleInviteSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={inviteForm.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Travel Consultation"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={inviteForm.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                                Note
                            </label>
                            <textarea
                                id="note"
                                value={inviteForm.note}
                                onChange={(e) => handleInputChange('note', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Add any additional notes..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    value={inviteForm.date}
                                    onChange={(e) => handleInputChange('date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                                    Time
                                </label>
                                <input
                                    type="time"
                                    id="time"
                                    value={inviteForm.time}
                                    onChange={(e) => handleInputChange('time', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsInviteModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Send Invite
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default TravelDashboard;