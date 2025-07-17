import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface TripFormData {
  travelName: string;
  continent: string;
  country: string;
  startDate: string;
  endDate: string;
  numberOfPeople: string;
  pricePoint: string;
  heroImage: string; // base64 encoded hero image
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
  duration: string;
  location: string;
  bulletPoints: string[];
  images: string[]; // base64 encoded images
}

interface Day {
  id: string;
  dayNumber: number;
  activities: Activity[];
}

// Image compression utility
const compressImage = (file: File, maxSizeKB: number = 256): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions to keep aspect ratio
      const maxWidth = 800;
      const maxHeight = 600;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Start with quality 0.8 and reduce until under maxSizeKB
      let quality = 0.8;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);
      
      while (dataUrl.length > maxSizeKB * 1024 * 1.37 && quality > 0.1) { // 1.37 accounts for base64 overhead
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }
      
      resolve(dataUrl);
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Helper function to calculate duration
const calculateDuration = (startDate: string, endDate: string): string => {
  if (!startDate || !endDate) return '';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end <= start) return '';
  
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

const EditTrip = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<TripFormData>({
    travelName: '',
    continent: '',
    country: '',
    startDate: '',
    endDate: '',
    numberOfPeople: '1',
    pricePoint: '',
    heroImage: '',
    allowSpecialRequests: false,
  });

  // Stops state
  const [stops, setStops] = useState<Stop[]>([]);
  const [newStopName, setNewStopName] = useState('');
  const [newStopAddress, setNewStopAddress] = useState('');

  // Days and activities state
  const [days, setDays] = useState<Day[]>([]);

  // Fetch trip data on component mount
  useEffect(() => {
    const fetchTripData = async () => {
      if (!id) {
        setError('Trip ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const tripRef = doc(db, 'trips', id);
        const tripSnap = await getDoc(tripRef);
        
        if (!tripSnap.exists()) {
          setError('Trip not found');
          setLoading(false);
          return;
        }
        
        const tripData = tripSnap.data();
        
        // Populate form data
        if (tripData.formData) {
          setFormData(tripData.formData);
        }
        
        // Populate stops
        if (tripData.stops && Array.isArray(tripData.stops)) {
          setStops(tripData.stops);
        }
        
        // Populate days
        if (tripData.days && Array.isArray(tripData.days)) {
          setDays(tripData.days);
        }
        
      } catch (err) {
        console.error('Error fetching trip:', err);
        setError('Failed to load trip data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [id]);

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
          duration: 'Enter Duration',
          location: 'Enter location',
          bulletPoints: ['Bulletin for summary'],
          images: []
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
      duration: 'Enter Duration',
      location: 'Enter location',
      bulletPoints: ['Bulletin for summary'],
      images: []
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

  const addBulletPoint = (dayId: string, activityId: string) => {
    setDays(prev => prev.map(day => 
      day.id === dayId 
        ? { 
            ...day, 
            activities: day.activities.map(activity => 
              activity.id === activityId 
                ? { ...activity, bulletPoints: [...activity.bulletPoints, 'New bullet point'] }
                : activity
            )
          }
        : day
    ));
  };

  const updateBulletPoint = (dayId: string, activityId: string, bulletIndex: number, value: string) => {
    setDays(prev => prev.map(day => 
      day.id === dayId 
        ? { 
            ...day, 
            activities: day.activities.map(activity => 
              activity.id === activityId 
                ? { 
                    ...activity, 
                    bulletPoints: activity.bulletPoints.map((bullet, index) => 
                      index === bulletIndex ? value : bullet
                    )
                  }
                : activity
            )
          }
        : day
    ));
  };

  const removeBulletPoint = (dayId: string, activityId: string, bulletIndex: number) => {
    setDays(prev => prev.map(day => 
      day.id === dayId 
        ? { 
            ...day, 
            activities: day.activities.map(activity => 
              activity.id === activityId 
                ? { 
                    ...activity, 
                    bulletPoints: activity.bulletPoints.filter((_, index) => index !== bulletIndex)
                  }
                : activity
            )
          }
        : day
    ));
  };

  const handleImageUpload = async (dayId: string, activityId: string, files: FileList) => {
    const newImages: string[] = [];
    
    for (let i = 0; i < Math.min(files.length, 5); i++) { // Limit to 5 images
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          const compressedImage = await compressImage(file, 256);
          newImages.push(compressedImage);
        } catch (error) {
          console.error('Error compressing image:', error);
          alert(`Error processing image: ${file.name}`);
        }
      }
    }
    
    if (newImages.length > 0) {
      setDays(prev => prev.map(day => 
        day.id === dayId 
          ? { 
              ...day, 
              activities: day.activities.map(activity => 
                activity.id === activityId 
                  ? { ...activity, images: [...activity.images, ...newImages] }
                  : activity
              )
            }
          : day
      ));
    }
  };

  const removeImage = (dayId: string, activityId: string, imageIndex: number) => {
    setDays(prev => prev.map(day => 
      day.id === dayId 
        ? { 
            ...day, 
            activities: day.activities.map(activity => 
              activity.id === activityId 
                ? { ...activity, images: activity.images.filter((_, index) => index !== imageIndex) }
                : activity
            )
          }
        : day
    ));
  };

  const handleHeroImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    try {
      const compressedImage = await compressImage(file, 256);
      setFormData(prev => ({ ...prev, heroImage: compressedImage }));
    } catch (error) {
      console.error('Error compressing hero image:', error);
      alert('Error processing image. Please try again.');
    }
  };

  const removeHeroImage = () => {
    setFormData(prev => ({ ...prev, heroImage: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      alert('Trip ID not found');
      return;
    }
    
    setSaving(true);
    
    try {
      const tripData = {
        formData,
        stops,
        days,
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Updating trip:', tripData);
      
      const tripRef = doc(db, 'trips', id);
      await setDoc(tripRef, tripData, { merge: true }); // Use merge to preserve createdAt
      console.log('Trip updated successfully with ID: ', id);
      
      alert('Trip updated successfully!');
      navigate('/admin2/trips');
    } catch (error) {
      console.error('Error updating trip:', error);
      alert('Failed to update trip. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading trip data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/admin2/trips')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Edit Itinerary</h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
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

                  {/* Date Range Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        min={formData.startDate || undefined}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Calculated Duration Display */}
                  {calculateDuration(formData.startDate, formData.endDate) && (
                    <div className="text-sm text-gray-500">
                      Duration: {calculateDuration(formData.startDate, formData.endDate)}
                    </div>
                  )}

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

                  {/* Hero Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hero Image
                    </label>
                    <div className="flex items-center space-x-2">
                      {formData.heroImage ? (
                        <div className="relative group">
                          <img
                            src={formData.heroImage}
                            alt="Hero"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={removeHeroImage}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                          <input
                            type="file"
                            id="hero-image-upload"
                            accept="image/*"
                            onChange={(e) => e.target.files && handleHeroImageUpload(e.target.files[0])}
                            className="hidden"
                          />
                          <label htmlFor="hero-image-upload" className="cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              Click to upload hero image
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Max 256KB
                            </p>
                          </label>
                        </div>
                      )}
                    </div>
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

                  <div className="space-y-6">
                    {day.activities.map((activity) => (
                      <div key={activity.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                        {/* Event Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Title
                          </label>
                          <input
                            type="text"
                            value={activity.title}
                            onChange={(e) => updateActivity(day.id, activity.id, { title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter event title"
                          />
                        </div>

                        {/* Event Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Description
                          </label>
                          <textarea
                            value={activity.description}
                            onChange={(e) => updateActivity(day.id, activity.id, { description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                            placeholder="Enter event description"
                          />
                        </div>

                        {/* Duration and Location Row */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Duration
                            </label>
                            <input
                              type="text"
                              value={activity.duration}
                              onChange={(e) => updateActivity(day.id, activity.id, { duration: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Duration"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Event Address
                            </label>
                            <input
                              type="text"
                              value={activity.location}
                              onChange={(e) => updateActivity(day.id, activity.id, { location: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter location"
                            />
                          </div>
                        </div>

                        {/* Bulletin Points */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Summary Points
                          </label>
                          <div className="space-y-2">
                            {activity.bulletPoints.map((bullet, bulletIndex) => (
                              <div key={bulletIndex} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                <input
                                  type="text"
                                  value={bullet}
                                  onChange={(e) => updateBulletPoint(day.id, activity.id, bulletIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter bullet point"
                                />
                                {activity.bulletPoints.length > 1 && (
                                  <button
                                    onClick={() => removeBulletPoint(day.id, activity.id, bulletIndex)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              onClick={() => addBulletPoint(day.id, activity.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Point
                            </button>
                          </div>
                        </div>

                        {/* Image Upload Section */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trip Pictures
                          </label>
                          
                          {/* Image Grid */}
                          {activity.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              {activity.images.map((image, imageIndex) => (
                                <div key={imageIndex} className="relative group">
                                  <img
                                    src={image}
                                    alt={`Activity ${imageIndex + 1}`}
                                    className="w-full h-20 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={() => removeImage(day.id, activity.id, imageIndex)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Upload Area */}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                            <input
                              type="file"
                              id={`images-${activity.id}`}
                              multiple
                              accept="image/*"
                              onChange={(e) => e.target.files && handleImageUpload(day.id, activity.id, e.target.files)}
                              className="hidden"
                            />
                            <label htmlFor={`images-${activity.id}`} className="cursor-pointer">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">
                                Click to upload images or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Max 256KB per image, up to 5 images
                              </p>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add activity button */}
                    <button
                      onClick={() => addActivity(day.id)}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-blue-600 hover:text-blue-800 hover:border-blue-400 transition-colors flex items-center justify-center"
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

export default EditTrip;
