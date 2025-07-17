import {  MapPin, Calendar, DollarSign, MoreHorizontal } from 'lucide-react';


const AdminDashboard = () => {

    // Mock data for calendar events
    const dashboardData = {
        sales: { value: '$574.34', change: '+23% since last month' },
        newTrips: { value: '154', change: '' },
        totalTrips: { value: '2935', change: '' },
        consultations: [
          { user: 'John, Doe', consultant: 'Multiple', revenue: '$14,000', completion: '2026, June 7' },
          { user: 'John, Doe', consultant: 'Single', revenue: '$3,000', completion: '2025, June 7' },
          { user: 'John, Doe', consultant: 'Single', revenue: 'Not set', completion: '2025, June 7' },
          { user: 'John, Doe', consultant: 'Multiple', revenue: '$32,000', completion: '2025, June 7' },
          { user: 'John, Doe', consultant: 'Multiple', revenue: '$400', completion: '2025, June 7' },
          { user: 'John, Doe', consultant: 'Single', revenue: '$7,600', completion: '2025, June 6' }
        ],
        recentConsultations: [
          { name: 'Esther Jackson', email: 'esther@simmmple.com', trip: 'Vietnam', status: 'Consulted', date: '14/06/21' },
          { name: 'Alexa Liras', email: 'alexa@simmmple.com', trip: 'Beijing', status: 'Consulted', date: '14/06/21' },
          { name: 'Laurent Michajel', email: 'laurent@simmmple.com', trip: 'Shanghai', status: 'Consulted', date: '14/06/21' },
          { name: 'Freduardo Hill', email: 'freduardo@simmmple.com', trip: 'Beijing', status: 'Consulted', date: '14/06/21' },
          { name: 'Daniel Thomas', email: 'daniel@simmmple.com', trip: 'Shanghai', status: 'Consulted', date: '14/06/21' },
          { name: 'Mark Wilson', email: 'mark@simmmple.com', trip: 'Shanghai', status: 'Cancelled', date: '14/06/21' }
        ]
      };


    const getStatusColor = (status: string) => {
        switch (status) {
        case 'Active': return 'bg-green-100 text-green-800';
        case 'Consulted': return 'bg-green-500 text-white';
        case 'Cancelled': return 'bg-gray-300 text-gray-600';
        default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sales</p>
                <p className="text-2xl font-bold">{dashboardData.sales.value}</p>
                <p className="text-sm text-green-600">{dashboardData.sales.change}</p>
              </div>
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Trips</p>
                <p className="text-2xl font-bold">{dashboardData.newTrips.value}</p>
              </div>
              <div className="bg-blue-500 rounded-full p-2">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold">{dashboardData.totalTrips.value}</p>
              </div>
              <div className="bg-purple-500 rounded-full p-2">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Consultations Section */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Consultations</h2>
              <button className="p-2">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-green-600 mt-1">● 30 done this month</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consulter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.consultations.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {item.user.charAt(0)}
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900">{item.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {item.consultant === 'Multiple' ? (
                          <>
                            <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                            <div className="w-6 h-6 bg-pink-500 rounded-full"></div>
                          </>
                        ) : (
                          <>
                            <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.revenue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{item.completion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Consultations */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Consultations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consulted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recentConsultations.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-8 w-8 rounded-full" src="/api/placeholder/32/32" alt="" />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.trip}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <button className="hover:text-blue-800">Actions</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    );
};

export default AdminDashboard;
