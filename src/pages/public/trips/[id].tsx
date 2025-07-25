import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Clock } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { db } from '../../../firebase';
import { doc, getDoc, collection, addDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';
import ConsultationDateModal from './components/ConsultationDateModal';
import PictureModal from './components/PictureModal';
import HeroYouTube from '../../../components/HeroYoutube';

interface TripFormData {
  travelName: string;
  continent: string;
  country: string;
  startDate: string;
  endDate: string;
  numberOfPeople: string;
  pricePoint: string;
  heroImage: string;
  heroVideo: string;
  allowSpecialRequests: boolean;
}

interface Activity {
  id: string;
  type: 'activity' | 'transport' | 'accommodation';
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

interface Stop {
  id: string;
  name: string;
  address: string;
}

interface TripData {
  formData: TripFormData;
  stops: Stop[];
  days: Day[];
  createdAt: string;
  updatedAt?: string;
}

// Helper function to convert base64 to blob URL or return original URL
const getImageUrl = (imageData: string): string => {
  if (!imageData) return '/trip_hero_image.webp';
  
  // If it's already a URL, return as is
  if (imageData.startsWith('http') || imageData.startsWith('/')) {
    return imageData;
  }
  
  // Check if it looks like base64 data (should start with data: or be a long string without spaces)
  const isBase64 = imageData.startsWith('data:') || 
                   (imageData.length > 100 && !imageData.includes(' ') && /^[A-Za-z0-9+/]*={0,2}$/.test(imageData));
  
  if (!isBase64) {
    // If it doesn't look like base64, it might be a malformed string, return default
    return '/trip_hero_image.webp';
  }
  
  // If it's base64, convert to blob URL
  try {
    let base64String = imageData;
    
    // If it's a data URL, extract just the base64 part
    if (imageData.startsWith('data:')) {
      const base64Index = imageData.indexOf(',');
      if (base64Index !== -1) {
        base64String = imageData.substring(base64Index + 1);
      }
    }
    
    // Validate base64 string before attempting to decode
    if (!base64String || base64String.length === 0) {
      return '/trip_hero_image.webp';
    }
    
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error converting base64 to blob:', error);
    return '/trip_hero_image.webp';
  }
};

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
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
  console.log('User phone number:', user);

  const handleConsultationSubmit = async (consultationData: { date: string, time: string, notes: string }) => {
    try {
      console.log('Booking consultation for user:', user?.email);
      const consultationDoc = {
        tripId: id,
        userEmail: user?.email || 'Not available',
        userName: user?.name || 'Not available',
        userPhoneNumber: user?.phoneNumber || 'Not available',
        status: 'Pending',
        tripName: tripData?.formData.travelName || 'Not available',
        tripPrice: tripData?.formData.pricePoint || 'Not available',
        tripStartDate: tripData?.formData.startDate || 'Not available',
        tripEndDate: tripData?.formData.endDate || 'Not available',
        tripCountry: tripData?.formData.country || 'Not available',
        tripContinent: tripData?.formData.continent || 'Not available',
        consultationDate: consultationData.date,
        consultationTime: consultationData.time,
        consultationNotes: consultationData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add consultation to the consultations collection
      const consultationRef = await addDoc(collection(db, 'consultations'), consultationDoc);
      console.log('Consultation created with ID:', consultationRef.id);

      // Also add to user's calendar if user is authenticated
      if (user?.email) {
        try {
          const userCalendarRef = doc(db, 'calendar', user.email);
          const userCalendarSnap = await getDoc(userCalendarRef);
          
          const newEvent = {
            id: crypto.randomUUID(),
            title: `Consultation: ${tripData?.formData.travelName}`,
            type: 'consultation',
            date: consultationData.date,
            time: consultationData.time,
            notes: consultationData.notes || `Travel consultation for ${tripData?.formData.travelName}`,
            userId: user.uid,
            userEmail: user.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          if (userCalendarSnap.exists()) {
            const existingCalendar = userCalendarSnap.data();
            const updatedEvents = [...(existingCalendar.events || []), newEvent];
            await updateDoc(userCalendarRef, {
              events: updatedEvents,
              updatedAt: new Date().toISOString()
            });
          } else {
            await setDoc(userCalendarRef, {
              userEmail: user.email,
              events: [newEvent],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
          
          console.log('Consultation added to user calendar');
        } catch (calendarError) {
          console.error('Error adding to calendar:', calendarError);
          // Don't fail the whole operation if calendar update fails
        }
      }
      
      alert(`Consultation scheduled successfully for ${new Date(consultationData.date).toLocaleDateString()} at ${consultationData.time}! We will send you a confirmation email shortly.`);
    } catch (error) {
      console.error('Error scheduling consultation:', error);
      alert('Failed to schedule consultation. Please try again.');
      throw error; // Re-throw to prevent modal from closing
    }
  };


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
            onClick={() => window.close()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  const { formData, stops, days } = tripData;

  const handleBookTrip = async () => {
    if (!user) {
      alert('Please log in to book this trip');
      return;
    }

    if (!id) {
      alert('Trip information not available');
      return;
    }

    // Show consultation modal instead of immediately booking
    setShowConsultationModal(true);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {
            formData.heroVideo ? 
            <HeroYouTube
              videoUrl={formData.heroVideo}
              className="w-full h-64 md:h-96 object-cover"
              mute={true}
              autoPlay={false}
            />
            :
            <img 
              src={getImageUrl(formData.heroImage)} 
              alt={formData.travelName}
              className="w-full h-64 md:h-96 object-cover"
            />
          }
          {/* {formData.heroImage && (
            <img 
              src={getImageUrl(formData.heroImage)} 
              alt={formData.travelName}
              className="w-full h-64 md:h-96 object-cover"
            />
          )} */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">{formData.travelName}</h1>
              <div className="text-3xl font-bold text-blue-600">{formData.pricePoint || 'Contact for pricing'}</div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{formData.country}, {formData.continent}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{formData.startDate} - {formData.endDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>{formData.numberOfPeople} {parseInt(formData.numberOfPeople) === 1 ? 'person' : 'people'}</span>
              </div>
            </div>

            <button
              onClick={() => {
                handleBookTrip();
              }}
              className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Book This Trip
            </button>
          </div>
        </div>

        {/* Stops Section */}
        {stops && stops.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Stops</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stops.map((stop, index) => (
                <div key={stop.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-gray-900">{stop.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{stop.address}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Itinerary */}
        {days && days.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Itinerary</h2>
            <div className="space-y-8">
              {days.map((day) => (
                <div key={day.id} className="border-l-4 border-blue-600 pl-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Day {day.dayNumber}</h3>
                  <div className="space-y-6">
                    {day.activities.map((activity) => (
                      <div key={activity.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{activity.title}</h4>
                            <p className="text-gray-600">{activity.description}</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {activity.type}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{activity.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{activity.location}</span>
                          </div>
                        </div>
                        
                        {activity.bulletPoints && activity.bulletPoints.length > 0 && (
                          <ul className="list-disc list-inside text-gray-700 text-sm mb-4 space-y-1">
                            {activity.bulletPoints.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        )}
                        
                        {activity.images && activity.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {activity.images.map((image, index) => (
                              <img 
                                key={index}
                                src={getImageUrl(image)} 
                                alt={`${activity.title} - Image ${index + 1}`}
                                className="w-full h-30 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => {
                                  setSelectedImageUrl(image);
                                  setShowPictureModal(true);
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ConsultationDateModal
        isOpen={showConsultationModal}
        onClose={() => setShowConsultationModal(false)}
        onSubmit={handleConsultationSubmit}
        tripName={formData?.travelName}
      />
      <PictureModal 
        isOpen={showPictureModal}
        onClose={() => setShowPictureModal(false)}
        imageUrl={selectedImageUrl}
      />
    </div>
  );
};

export default TripDetails; 