import { useState } from 'react';
import AdminTrips from './trips';
import AdminCalendar from './calendar';
import AdminDashboard from './dashboard';
import AdminConsultations from './consulations';
import AdminJobs from './jobs';
import AdminCV from './cv';

const AdminIndex = () => {
  const [currentPage, setCurrentPage] = useState('consultations');

  const renderNavigation = () => (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              currentPage === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('consultations')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              currentPage === 'consultations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Consultations
          </button>
          <button
            onClick={() => setCurrentPage('destinations')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              currentPage === 'destinations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Destinations
          </button>
          <button
            onClick={() => setCurrentPage('jobs')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              currentPage === 'jobs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Jobs
          </button>
          <button
            onClick={() => setCurrentPage('cv')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              currentPage === 'cv'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            CV
          </button>
          <button
            onClick={() => setCurrentPage('calendar')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              currentPage === 'calendar'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'consultations':
        return <AdminConsultations />;
      case 'destinations':
        return <AdminTrips />
      case 'calendar':
        return <AdminCalendar />;
      case 'jobs':
        return <AdminJobs />;
      case 'cv':
        return <AdminCV />;
      default:
        return <AdminConsultations />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      {renderCurrentPage()}
    </div>
  );
};

export default AdminIndex;