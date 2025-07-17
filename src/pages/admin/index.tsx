import React, { useState } from 'react';
import { Search, Plus, Users, MapPin, Calendar, DollarSign, Filter, MoreHorizontal } from 'lucide-react';
import { mockTableData, type TableRow } from './consulations/components/mockData';
import AdminTrips from './trips';
import AdminCalendar from './calendar';
import AdminDashboard from './dashboard';
import AdminConsultations from './consulations';
import AdminJobs from './jobs';
import AdminCV from './cv';

const AdminIndex = () => {
  const [currentPage, setCurrentPage] = useState('consultations');

  // Mock data for the consultations table
  const [consultationsData, setConsultationsData] = useState<TableRow[]>(mockTableData);
  // Mock data for destinations
  const destinationsData = {
    asia: [
      { name: 'Vietnam', description: 'As Uber works through a huge amount of internal management turmoil.', image: '/api/placeholder/300/200' },
      { name: 'Japan', description: 'Music is something that every person has his or her own specific opinion about.', image: '/api/placeholder/300/200' },
      { name: 'China', description: 'Different people have different tastes, and various types of music.', image: '/api/placeholder/300/200' }
    ],
    europe: [
      { name: 'France', description: 'As Uber works through a huge amount of internal management turmoil.', image: '/api/placeholder/300/200' },
      { name: 'UK', description: 'Music is something that every person has his or her own specific opinion about.', image: '/api/placeholder/300/200' },
      { name: 'Italy', description: 'Different people have different tastes, and various types of music.', image: '/api/placeholder/300/200' }
    ]
  };

  // Mock data for calendar events
  const calendarEvents = [
    { date: 1, events: [{ title: 'Chincoteague', type: 'appointment' }] },
    { date: 3, events: [{ title: 'Meeting w/ Chris', type: 'meeting' }] },
    { date: 5, events: [{ title: 'Lunch w/ Mom', type: 'personal' }] },
    { date: 7, events: [{ title: 'Financial Advisor Meeting', type: 'meeting' }] },
    { date: 8, events: [{ title: 'Interview w/ Agent', type: 'interview' }, { title: 'Send follow-up email', type: 'task' }] },
    { date: 12, events: [{ title: "Audrey's Chef Recital", type: 'event' }] },
    { date: 15, events: [{ title: 'Vaccine appt.', type: 'appointment' }, { title: 'Take Jane to dentist', type: 'task' }] },
    { date: 17, events: [{ title: "St. Patrick's Day", type: 'holiday' }] },
    { date: 19, events: [{ title: 'PTO day', type: 'personal' }] },
    { date: 20, events: [{ title: 'Dinner with Kate and Dan', type: 'personal' }] },
    { date: 22, events: [{ title: 'Important work meeting', type: 'meeting' }] },
    { date: 24, events: [{ title: 'Fly to Japan', type: 'travel' }] },
    { date: 25, events: [{ title: 'Hot dog eating contest', type: 'event' }] },
    { date: 27, events: [{ title: 'Meeting w/ Mac', type: 'meeting' }] },
    { date: 29, events: [{ title: 'Pick up very first car appt.', type: 'appointment' }] },
    { date: 31, events: [{ title: 'Learn something new', type: 'personal' }] }
  ];

  // Mock data for dashboard stats
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Consulted': return 'bg-green-500 text-white';
      case 'Cancelled': return 'bg-gray-300 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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