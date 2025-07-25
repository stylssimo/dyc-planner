import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export interface PublicTrip {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    videoUrl?: string;
    price: string;
    duration: string;
    continent: string;
    country: string;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt?: string;
    tripTags: string[];
    numberOfPeople: string;
    location: string;
    currency: string;
}

export const useTrips = () => {
  const [trips, setTrips] = useState<PublicTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to calculate duration from dates
  const calculateDuration = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return 'TBD';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) return 'TBD';
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day tour';
    if (diffDays < 7) return `${diffDays} days tour`;
    
    const weeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;
    
    let result = '';
    if (weeks === 1) result += '1 week';
    else if (weeks > 1) result += `${weeks} weeks`;
    
    if (remainingDays > 0) {
      if (result) result += ' ';
      result += remainingDays === 1 ? '1 day' : `${remainingDays} days`;
    }
    
    return result + ' tour';
  };

  console.log('asdfsdf')

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const tripsRef = collection(db, 'tripOverview');
        const q = query(tripsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedTrips: PublicTrip[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Only include trips that have complete data and could be considered "active"
          if (data.travelName) {
            const trip: PublicTrip = {
              id: doc.id,
              name: data.travelName,
              country: data.country,
              continent: data.continent || 'Unknown',
              duration: calculateDuration(data.startDate, data.endDate),
              description: `Experience ${data.travelName} with ${data.numberOfPeople || '1'} ${parseInt(data.numberOfPeople) === 1 ? 'person' : 'people'} • ${data.stops?.length || 0} amazing stops`,
              price: data.pricePoint || 'TBD',
              imageUrl: data.heroImage || '/trip_hero_image.webp',
              videoUrl: data.heroVideo || '',
              startDate: data.startDate || '',
              endDate: data.endDate || '',
              numberOfPeople: data.numberOfPeople || '1',
              location: `${data.country}${data.continent ? `, ${data.continent}` : ''}`,
              createdAt: data.createdAt || '',
              updatedAt: data.updatedAt || '',
              tripTags: data.tripTags || [],
              currency: data.currency === 'MNT' ? '₮' : '$'
            };
            
            fetchedTrips.push(trip);
          }
        });
        
        setTrips(fetchedTrips);
        console.log(fetchedTrips, 'fetchedTrips')
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError('Failed to load trips. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const searchTrips = (searchTerm: string, startDate?: string, endDate?: string, guests?: string) => {
    if (!searchTerm.trim() && !startDate && !endDate && !guests) {
      return trips;
    }

    return trips.filter(trip => {
      const matchesSearch = !searchTerm.trim() || 
        trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.continent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.country.toLowerCase().includes(searchTerm.toLowerCase());

      // For now, we'll just match on search term
      // Date and guest filtering can be added later when we implement more sophisticated search
      return matchesSearch;
    });
  };

  return {
    trips,
    loading,
    error,
    searchTrips
  };
}; 