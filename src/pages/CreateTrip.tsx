import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TripFormData {
  travelName: string;
  continent: string;
  country: string;
  duration: string;
  numberOfPeople: string;
  pricePoint: string;
  allowSpecialRequests: boolean;
}

interface Stop {
  id: string;
  name: string;
  address: string;
}

interface Activity {
  id: string;
  type: 'arrival' | 'activity' | 'meal' | 'optional';
  title: string;
  description: string;
  time?: string;
  duration?: string;
  location?: string;
  images?: string[];
}

interface Day {
  id: string;
  dayNumber: number;
  activities: Activity[];
}

const CreateTrip = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<TripFormData>({
    travelName: '',
    continent: '',
    country: '',
    duration: '',
    numberOfPeople: '1',
    pricePoint: '',
    allowSpecialRequests: false,
  });

  // Stops state
  const [stops, setStops] = useState<Stop[]>([
    { id: '1', name: 'Marseille', address: 'Marseille, France' },
    { id: '2', name: 'Arles', address: 'Arles, France' },
    { id: '3', name: 'Gordes', address: '84220 Gordes, France' },
    { id: '4', name: 'Avignon', address: 'Avignon, France' },
    { id: '5', name: 'Lyon', address: 'Lyon, France' },
    { id: '6', name: 'Beaune', address: '21200 Beaune, France' },
  ]);

  const [newStopName, setNewStopName] = useState('');
  const [newStopAddress, setNewStopAddress] = useState('');

  // Days and activities state
  const [days, setDays] = useState<Day[]>([
    {
      id: '1',
      dayNumber: 1,
      activities: [
        {
          id: '1',
          type: 'arrival',
          title: 'Arrival in Marseille and private transfer to the hotel',
          description: '',
        },
        {
          id: '2',
          type: 'activity',
          title: 'Evening cocktail reception with fellow travelers and dinner at the hotel',
          description: '',
        },
        {
          id: '3',
          type: 'optional',
          title: 'Early arrival with a pre-night in Marseille ($)',
          description: '',
        },
        {
          id: '4',
          type: 'meal',
          title: 'Meals: D',
          description: '',
        },
        {
          id: '5',
          type: 'optional',
          title: 'Optional Walking Tour',
          description: 'Stroll the narrow streets and staircases of the emblematic "Panier", Marseille\'s oldest district! Between history, anecdotes and the art of living, discover the first heart of the city from its origins to the present day.',
          location: 'Port Antique, 13001 Marseille',
          duration: '2hrs',
          images: ['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400']
        }
      ]
    },
    {
      id: '2',
      dayNumber: 2,
      activities: [
        {
          id: '6',
          type: 'activity',
          title: 'Bulletin for summary',
          description: '',
        },
        {
          id: '7',
          type: 'activity',
          title: 'Enter event title',
          description: 'Event destination',
          time: '',
        }
      ]
    }
  ]);

  // Local storage key
  const STORAGE_KEY = 'create-trip-form-data';

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.stops) setStops(parsed.stops);
        if (parsed.days) setDays(parsed.days);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      formData,
      stops,
      days,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [formData, stops, days]);

  const handleInputChange = (field: keyof TripFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addStop = () => {
    if (newStopName.trim() && newStopAddress.trim()) {
      const newStop: Stop = {
        id: Date.now().toString(),
        name: newStopName.trim(),
        address: newStopAddress.trim(),
      };
      setStops(prev => [...prev, newStop]);
      setNewStopName('');
      setNewStopAddress('');
    }
  };

  const removeStop = (stopId: string) => {
    setStops(prev => prev.filter(stop => stop.id !== stopId));
  };

  const addDay = () => {
    const newDay: Day = {
      id: Date.now().toString(),
      dayNumber: days.length + 1,
      activities: [
        {
          id: Date.now().toString(),
          type: 'activity',
          title: 'Enter event title',
          description: 'Event destination',
        }
      ]
    };
    setDays(prev => [...prev, newDay]);
  };

  const addActivity = (dayId: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type: 'activity',
      title: 'Enter event title',
      description: 'Event destination',
    };
    
    setDays(prev => prev.map(day => 
      day.id === dayId 
        ? { ...day, activities: [...day.activities, newActivity] }
        : day
    ));
  };

  const updateActivity = (dayId: string, activityId: string, updates: Partial<Activity>) => {
    setDays(prev => prev.map(day => 
      day.id === dayId 
        ? { 
            ...day, 
            activities: day.activities.map(activity => 
              activity.id === activityId ? { ...activity, ...updates } : activity
            )
          }
        : day
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tripData = {
      formData,
      stops,
      days,
      createdAt: new Date().toISOString(),
    };
    
    console.log('Trip created:', tripData);
    
    // Here you would typically send the data to your backend
    alert('Trip created successfully!');
    
    // Clear localStorage after successful submission
    localStorage.removeItem(STORAGE_KEY);
    
    // Navigate back to trips page
    navigate('/admin2');
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      setFormData({
        travelName: '',
        continent: '',
        country: '',
        duration: '',
        numberOfPeople: '1',
        pricePoint: '',
        allowSpecialRequests: false,
      });
      setStops([]);
      setDays([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin2/trips')}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Trips
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Create Itinerary</h1>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={clearAllData}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
              >
                Clear All
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Travel name"
                      value={formData.travelName}
                      onChange={(e) => handleInputChange('travelName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Continent"
                      value={formData.continent}
                      onChange={(e) => handleInputChange('continent', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <select
                      value={formData.numberOfPeople}
                      onChange={(e) => handleInputChange('numberOfPeople', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">Number of people</option>
                      {[...Array(20)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'person' : 'people'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Price point"
                      value={formData.pricePoint}
                      onChange={(e) => handleInputChange('pricePoint', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allowSpecialRequests"
                      checked={formData.allowSpecialRequests}
                      onChange={(e) => handleInputChange('allowSpecialRequests', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="allowSpecialRequests" className="text-gray-700">
                      Allow special requests
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Stops and Itinerary */}
          <div className="space-y-6">
            {/* Stops Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Stops</h2>
              <div className="space-y-3 mb-4">
                {stops.map((stop, index) => (
                  <div key={stop.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {index + 1}. {stop.name}
                      </div>
                      <div className="text-sm text-gray-500">{stop.address}</div>
                    </div>
                    <button
                      onClick={() => removeStop(stop.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Stop */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Enter City"
                    value={newStopName}
                    onChange={(e) => setNewStopName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="City Address"
                    value={newStopAddress}
                    onChange={(e) => setNewStopAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addStop}
                    className="w-full flex items-center justify-center py-2 text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Stop
                  </button>
                </div>
              </div>
            </div>

            {/* Days Section */}
            <div className="space-y-6">
              {days.map((day) => (
                <div key={day.id} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-2">
                      {day.dayNumber}
                    </span>
                    Day {day.dayNumber}
                  </h3>

                  <div className="space-y-4">
                    {day.activities.map((activity) => (
                      <div key={activity.id} className="border-l-2 border-gray-200 pl-4">
                        {activity.type === 'optional' && activity.title === 'Optional Walking Tour' ? (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">Optional Walking Tour</span>
                            </div>
                            <div className="font-medium">{activity.title}</div>
                            <div className="text-sm text-gray-600">{activity.location}</div>
                            <div className="text-sm">
                              <span className="font-medium">Duration</span><br />
                              {activity.duration}
                            </div>
                            <div className="text-sm text-gray-600">{activity.description}</div>
                            
                            {/* Image carousel */}
                            {activity.images && activity.images.length > 0 && (
                              <div className="relative">
                                <img 
                                  src={activity.images[0]} 
                                  alt="Activity" 
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                  {activity.images.map((_, idx) => (
                                    <div key={idx} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-white' : 'bg-gray-400'}`} />
                                  ))}
                                </div>
                                <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-1">
                                  <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-1">
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <input
                                type="text"
                                value={activity.title}
                                onChange={(e) => updateActivity(day.id, activity.id, { title: e.target.value })}
                                className="flex-1 text-sm bg-transparent border-none outline-none"
                                placeholder="Enter event title"
                              />
                            </div>
                            {activity.description && (
                              <input
                                type="text"
                                value={activity.description}
                                onChange={(e) => updateActivity(day.id, activity.id, { description: e.target.value })}
                                className="text-sm text-gray-600 bg-transparent border-none outline-none w-full"
                                placeholder="Event destination"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add activity button */}
                    <button
                      onClick={() => addActivity(day.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Activity
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Day Button */}
              <button
                onClick={addDay}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Day {days.length + 1}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip; 