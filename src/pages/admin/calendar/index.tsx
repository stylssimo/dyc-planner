import { useState } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

type EventType = 'appointment' | 'meeting' | 'personal' | 'interview' | 'task' | 'event' | 'holiday' | 'travel';

interface Event {
    title: string;
    type: EventType;
    notes?: string;
    time?: string;
}

interface CalendarEvent {
    date: number;
    events: Event[];
}

const AdminCalendar = () => {

    // Mock data for calendar events
    const calendarEvents: CalendarEvent[] = [
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
    
    const [refreshKey, setRefreshKey] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState<'month' | 'week' | 'year'>('month');
    const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); // March 2025
    const [events, setEvents] = useState<CalendarEvent[]>(calendarEvents);
    
    // Form state for add event modal
    const [eventForm, setEventForm] = useState({
        name: '',
        type: 'event' as EventType,
        notes: '',
        date: '',
        time: ''
    });

    // Color mapping for different event types
    const eventColors: Record<EventType, string> = {
        appointment: 'bg-blue-100 text-blue-800',
        meeting: 'bg-green-100 text-green-800',
        personal: 'bg-purple-100 text-purple-800',
        interview: 'bg-yellow-100 text-yellow-800',
        task: 'bg-gray-100 text-gray-800',
        event: 'bg-pink-100 text-pink-800',
        holiday: 'bg-red-100 text-red-800',
        travel: 'bg-indigo-100 text-indigo-800'
    };

    // Navigation functions
    const navigatePrevious = () => {
        const newDate = new Date(currentDate);
        if (currentView === 'month') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else if (currentView === 'week') {
            newDate.setDate(newDate.getDate() - 7);
        } else if (currentView === 'year') {
            newDate.setFullYear(newDate.getFullYear() - 1);
        }
        setCurrentDate(newDate);
    };

    const navigateNext = () => {
        const newDate = new Date(currentDate);
        if (currentView === 'month') {
            newDate.setMonth(newDate.getMonth() + 1);
        } else if (currentView === 'week') {
            newDate.setDate(newDate.getDate() + 7);
        } else if (currentView === 'year') {
            newDate.setFullYear(newDate.getFullYear() + 1);
        }
        setCurrentDate(newDate);
    };

    // Format header based on current view
    const getHeaderTitle = () => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        
        if (currentView === 'year') {
            return currentDate.getFullYear().toString();
        } else if (currentView === 'week') {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            
            return `${months[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${months[endOfWeek.getMonth()]} ${endOfWeek.getDate()}, ${currentDate.getFullYear()}`;
        } else {
            return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        }
    };

    // Get month name helper
    const getMonthName = (monthIndex: number) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthIndex];
    };

    // Event management functions
    const handleAddEvent = () => {
        if (!eventForm.name || !eventForm.date) {
            alert('Please fill in event name and date');
            return;
        }

        const eventDate = new Date(eventForm.date);
        const day = eventDate.getDate();
        
        const newEvent = {
            title: eventForm.name,
            type: eventForm.type,
            notes: eventForm.notes,
            time: eventForm.time
        };

        setEvents(prevEvents => {
            const existingEventIndex = prevEvents.findIndex(e => e.date === day);
            
            if (existingEventIndex >= 0) {
                // Add to existing date
                const updatedEvents = [...prevEvents];
                updatedEvents[existingEventIndex] = {
                    ...updatedEvents[existingEventIndex],
                    events: [...updatedEvents[existingEventIndex].events, newEvent]
                };
                return updatedEvents;
            } else {
                // Create new date entry
                return [...prevEvents, { date: day, events: [newEvent] }];
            }
        });

        // Reset form and close modal
        setEventForm({
            name: '',
            type: 'event',
            notes: '',
            date: '',
            time: ''
        });
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEventForm({
            name: '',
            type: 'event',
            notes: '',
            date: '',
            time: ''
        });
    };

    // Render month view
    const renderMonthView = () => {
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        
        const calendarDays = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="min-h-24 border border-gray-100 p-1"></div>);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const hasEvents = events.find(e => e.date === day);
            calendarDays.push(
                <div key={day} className="min-h-24 border border-gray-100 p-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                    {hasEvents?.events.map((event, idx) => (
                        <div key={idx} className={`text-xs p-1 mb-1 rounded truncate ${eventColors[event.type] || 'bg-gray-100 text-gray-800'}`}>
                            {event.title}
                        </div>
                    ))}
                </div>
            );
        }
        
        return (
            <div className="grid grid-cols-7 gap-1">
                {calendarDays}
            </div>
        );
    };

    // Render week view
    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            const dayNumber = day.getDate();
            const hasEvents = events.find(e => e.date === dayNumber);
            
            weekDays.push(
                <div key={i} className="min-h-96 border border-gray-100 p-2">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]} {dayNumber}
                    </div>
                    <div className="space-y-1">
                        {hasEvents?.events.map((event, idx) => (
                            <div key={idx} className={`text-xs p-2 rounded ${eventColors[event.type] || 'bg-gray-100 text-gray-800'}`}>
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        
        return (
            <div className="grid grid-cols-7 gap-1">
                {weekDays}
            </div>
        );
    };

    // Render year view
    const renderYearView = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const year = currentDate.getFullYear();
        
        return (
            <div className="grid grid-cols-3 gap-4">
                {months.map((month, index) => (
                    <div key={month} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">{month} {year}</h4>
                        <div className="grid grid-cols-7 gap-1 text-xs">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                <div key={day} className="text-center text-gray-500 font-medium">{day}</div>
                            ))}
                            {Array.from({ length: 35 }, (_, i) => {
                                const date = i - new Date(year, index, 1).getDay() + 1;
                                const isCurrentMonth = date >= 1 && date <= new Date(year, index + 1, 0).getDate();
                                const hasEvents = index === 2 && events.find(e => e.date === date); // Only March has events in mock data
                                
                                return (
                                    <div key={i} className={`text-center py-1 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300'} ${hasEvents ? 'bg-blue-200 rounded' : ''}`}>
                                        {isCurrentMonth ? date : ''}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">{getHeaderTitle()}</h1>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Event
                        </button>
                        <div className="flex bg-white rounded-lg shadow-sm">
                            <button 
                                onClick={() => setCurrentView('month')}
                                className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                                    currentView === 'month' ? 'text-white bg-blue-600' : 'text-gray-700 bg-white hover:bg-gray-50'
                                }`}
                            >
                                Month
                            </button>
                            <button 
                                onClick={() => setCurrentView('week')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                    currentView === 'week' ? 'text-white bg-blue-600' : 'text-gray-700 bg-white hover:bg-gray-50'
                                }`}
                            >
                                Week
                            </button>
                            <button 
                                onClick={() => setCurrentView('year')}
                                className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                                    currentView === 'year' ? 'text-white bg-blue-600' : 'text-gray-700 bg-white hover:bg-gray-50'
                                }`}
                            >
                                Year
                            </button>
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                onClick={navigatePrevious}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors"
                            >
                                ←
                            </button>
                            <button 
                                onClick={navigateNext}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors"
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Calendar Grid */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {currentView === 'month' && (
                                <>
                                    <div className="grid grid-cols-7 gap-1 mb-4">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    {renderMonthView()}
                                </>
                            )}
                            
                            {currentView === 'week' && renderWeekView()}
                            
                            {currentView === 'year' && renderYearView()}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Current Month Events */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {getHeaderTitle()} Events
                            </h3>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {events
                                    .filter(eventDay => {
                                        // Filter events for current month
                                        if (currentView === 'month') {
                                            return true; // Show all events for month view
                                        } else if (currentView === 'week') {
                                            const startOfWeek = new Date(currentDate);
                                            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                                            const endOfWeek = new Date(startOfWeek);
                                            endOfWeek.setDate(startOfWeek.getDate() + 6);
                                            
                                            return eventDay.date >= startOfWeek.getDate() && 
                                                   eventDay.date <= endOfWeek.getDate();
                                        }
                                        return true; // Show all for year view
                                    })
                                    .sort((a, b) => a.date - b.date)
                                    .map((eventDay) => (
                                        <div key={eventDay.date} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
                                            <div className="font-medium text-gray-900 mb-2">
                                                {eventDay.date} {currentView === 'month' ? getMonthName(currentDate.getMonth()) : ''}
                                            </div>
                                            <div className="space-y-2">
                                                {eventDay.events.map((event, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={`p-2 rounded-lg text-sm ${eventColors[event.type] || 'bg-gray-100 text-gray-800'}`}
                                                    >
                                                        <div className="font-medium">{event.title}</div>
                                                        {event.time && (
                                                            <div className="text-xs opacity-80 mt-1">
                                                                {event.time}
                                                            </div>
                                                        )}
                                                        {event.notes && (
                                                            <div className="text-xs opacity-80 mt-1">
                                                                {event.notes}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                }
                                {events.length === 0 && (
                                    <div className="text-center text-gray-500 py-4">
                                        No events scheduled
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Event Legend */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Event Types</h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-blue-100 rounded"></div>
                                    <span>Appointment</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-100 rounded"></div>
                                    <span>Meeting</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-purple-100 rounded"></div>
                                    <span>Personal</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                                    <span>Interview</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-gray-100 rounded"></div>
                                    <span>Task</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-pink-100 rounded"></div>
                                    <span>Event</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-100 rounded"></div>
                                    <span>Holiday</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-indigo-100 rounded"></div>
                                    <span>Travel</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Add New Event</h2>
                            <button 
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                X
                            </button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleAddEvent(); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Name *
                                </label>
                                <input
                                    type="text"
                                    value={eventForm.name}
                                    onChange={(e) => setEventForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter event name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Type (Color)
                                </label>
                                <select
                                    value={eventForm.type}
                                    onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value as EventType }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="appointment">Appointment</option>
                                    <option value="meeting">Meeting</option>
                                    <option value="personal">Personal</option>
                                    <option value="interview">Interview</option>
                                    <option value="task">Task</option>
                                    <option value="event">Event</option>
                                    <option value="holiday">Holiday</option>
                                    <option value="travel">Travel</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    value={eventForm.date}
                                    onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Time
                                </label>
                                <input
                                    type="time"
                                    value={eventForm.time}
                                    onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    value={eventForm.notes}
                                    onChange={(e) => setEventForm(prev => ({ ...prev, notes: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Additional notes (optional)"
                                    rows={3}
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCalendar;
