import  { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Star, Clock, Camera } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../../../firebase';
import { doc, getDoc } from 'firebase/firestore';

interface TripFormData {
  travelName: string;
  continent: string;
  country: string;
  startDate: string;
  endDate: string;
  numberOfPeople: string;
  pricePoint: string;
  heroImage: string;
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
  images: string[];
}

interface Day {
  id: string;
  dayNumber: number;
  activities: Activity[];
}

interface TripData {
  formData: TripFormData;
  stops: Stop[];
  days: Day[];
  createdAt: string;
  updatedAt?: string;
}

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

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Helper function to get activity type badge
const getActivityTypeBadge = (type: Activity['type']) => {
  const styles = {
    arrival: 'bg-blue-100 text-blue-800',
    activity: 'bg-green-100 text-green-800',
    meal: 'bg-orange-100 text-orange-800',
    optional: 'bg-purple-100 text-purple-800'
  };
  
  const labels = {
    arrival: 'Arrival',
    activity: 'Activity',
    meal: 'Meal',
    optional: 'Optional'
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[type]}`}>
      {labels[type]}
    </span>
  );
};

const ViewTrip = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // State
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        const data = tripSnap.data() as TripData;
        setTripData(data);
        
      } catch (err) {
        console.error('Error fetching trip:', err);
        setError('Failed to load trip data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading trip details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !tripData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Trip not found'}</p>
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

  const { formData, stops, days } = tripData;
  const duration = calculateDuration(formData.startDate, formData.endDate);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/admin2/trips')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Trips
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        {formData.heroImage ? (
          <div className="h-96 bg-gray-200 overflow-hidden">
            <img
              src={formData.heroImage}
              alt={formData.travelName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-96 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-2">{formData.travelName}</h1>
              <p className="text-xl opacity-90">{formData.country}</p>
            </div>
          </div>
        )}
        
        {formData.heroImage && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-2">{formData.travelName}</h1>
              <p className="text-xl opacity-90">{formData.country}</p>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Trip Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Destination</p>
                <p className="font-semibold">{formData.country}, {formData.continent}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold">{duration || 'TBD'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Group Size</p>
                <p className="font-semibold">
                  {formData.numberOfPeople} {parseInt(formData.numberOfPeople) === 1 ? 'person' : 'people'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-semibold">${formData.pricePoint || 'TBD'}</p>
              </div>
            </div>
          </div>

          {formData.startDate && formData.endDate && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-semibold">{formatDate(formData.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-semibold">{formatDate(formData.endDate)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Itinerary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerary</h2>
              
              <div className="space-y-8">
                {days.map((day) => (
                  <div key={day.id} className="relative">
                    {/* Day Header */}
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                        {day.dayNumber}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Day {day.dayNumber}</h3>
                    </div>

                    {/* Activities */}
                    <div className="ml-6 border-l-2 border-gray-200 pl-6 space-y-6">
                      {day.activities.map((activity) => (
                        <div key={activity.id} className="relative">
                          {/* Activity Marker */}
                          <div className="absolute -left-8 w-4 h-4 bg-white border-2 border-blue-600 rounded-full"></div>
                          
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {getActivityTypeBadge(activity.type)}
                                  {activity.duration && (
                                    <span className="inline-flex items-center text-sm text-gray-500">
                                      <Clock className="w-4 h-4 mr-1" />
                                      {activity.duration}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                  {activity.title}
                                </h4>
                                {activity.description && (
                                  <p className="text-gray-600 mb-3">{activity.description}</p>
                                )}
                                {activity.location && (
                                  <p className="text-sm text-gray-500 flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {activity.location}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Bullet Points */}
                            {activity.bulletPoints && activity.bulletPoints.length > 0 && (
                              <div className="mb-4">
                                <ul className="space-y-1">
                                  {activity.bulletPoints.map((bullet, bulletIndex) => (
                                    <li key={bulletIndex} className="flex items-start text-sm text-gray-600">
                                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                      {bullet}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Activity Images */}
                            {activity.images && activity.images.length > 0 && (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {activity.images.map((image, imageIndex) => (
                                  <div key={imageIndex} className="relative group">
                                    <img
                                      src={image}
                                      alt={`${activity.title} ${imageIndex + 1}`}
                                      className="w-full h-24 object-cover rounded-lg cursor-pointer transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                                      <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Trip Details */}
          <div className="space-y-6">
            {/* Stops */}
            {stops && stops.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Stops</h3>
                <div className="space-y-3">
                  {stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{stop.name}</p>
                        <p className="text-sm text-gray-500">{stop.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trip Highlights */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Highlights</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  {days.length} {days.length === 1 ? 'day' : 'days'} of adventure
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  {stops.length} {stops.length === 1 ? 'stop' : 'stops'} included
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Camera className="w-4 h-4 mr-2 text-green-500" />
                  {days.reduce((total, day) => 
                    total + day.activities.reduce((actTotal, activity) => 
                      actTotal + (activity.images?.length || 0), 0
                    ), 0
                  )} photo opportunities
                </div>
                {formData.allowSpecialRequests && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-purple-500" />
                    Special requests welcome
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/admin2/trips/edit/${id}`)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Trip
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Print Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTrip;
