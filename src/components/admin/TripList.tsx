import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import type { Trip } from '../../types/Trip';
import SpotList from './SpotList';
import AddSpotForm from './AddSpotForm';

interface TripListProps {
    onEdit: (trip: Trip) => void;
    refreshKey: number;
}

const TripList = ({ onEdit, refreshKey }: TripListProps) => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [expandedTripIds, setExpandedTripIds] = useState<string[]>([]);
    const [refreshKeys, setRefreshKeys] = useState<Record<string, number>>({});

    const fetchTrips = async () => {
        const snapshot = await getDocs(collection(db, 'trips'));
        const fetched = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Trip[];
        setTrips(fetched);
    };

    useEffect(() => {
        fetchTrips();
    }, [refreshKey]);

    const toggleExpand = (tripId: string) => {
        setExpandedTripIds(prev =>
            prev.includes(tripId) ? prev.filter(id => id !== tripId) : [...prev, tripId]
        );
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, 'trips', id));
        fetchTrips();
    };

    const triggerSpotRefresh = (tripId: string) => {
        setRefreshKeys(prev => ({
            ...prev,
            [tripId]: (prev[tripId] || 0) + 1,
        }));
    };

    return (
        <div className="space-y-4">
            {trips.map(trip => (
                <div key={trip.id} className="border rounded-lg p-4 bg-white shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-semibold">{trip.name}</h2>
                            <p className="text-sm text-gray-600">{trip.city}, {trip.country}</p>
                            <p className="text-xs text-gray-400">{trip.startDate} - {trip.endDate}</p>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => onEdit(trip)}
                                className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(trip.id)}
                                className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => toggleExpand(trip.id)}
                                className="px-2 py-1 text-sm bg-gray-100 border rounded"
                            >
                                {expandedTripIds.includes(trip.id) ? 'Hide Spots' : 'Manage Spots'}
                            </button>
                        </div>
                    </div>

                    {expandedTripIds.includes(trip.id) && (
                        <div className="mt-4 border-t pt-4">
                            <SpotList
                                key={`${trip.id}-${refreshKeys[trip.id] || 0}`}
                                tripId={trip.id}
                                onChange={() => triggerSpotRefresh(trip.id)}
                            />
                            <AddSpotForm
                                tripId={trip.id}
                                onChange={() => triggerSpotRefresh(trip.id)}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TripList;
