import { useState } from 'react';
import TripFormModal from '../components/admin/TripFormModal';
import TripList from '../components/admin/TripList';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Trip } from '../types/Trip';

const AdminDashboard = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTrip, setEditingTrip] = useState<(Trip & { id: string }) | null>(null);

    const handleCreateTrip = async (trip: Trip) => {
        if (editingTrip) {
            // Update existing
            const tripRef = doc(db, 'trips', editingTrip.id);
            await updateDoc(tripRef, { ...trip } as Partial<Trip>);
            console.log('Trip updated');
        } else {
            // Create new
            await addDoc(collection(db, 'trips'), {
                ...trip,
                createdAt: Date.now(), // ✅ Add timestamp
            });
            console.log('Trip created');
        }

        setRefreshKey((prev) => prev + 1);
        setEditingTrip(null);
        setIsModalOpen(false);
    };

    const handleEditTrip = (trip: Trip & { id: string }) => {
        setEditingTrip(trip);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => {
                        setEditingTrip(null);
                        setIsModalOpen(true);
                    }}
                >
                    + Create Trip
                </button>
            </div>

            <TripFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setEditingTrip(null);
                    setIsModalOpen(false);
                }}
                onSubmit={handleCreateTrip}
                initialData={editingTrip ?? undefined}
            />

            <TripList onEdit={handleEditTrip} refreshKey={refreshKey} />
        </div>
    );
};

export default AdminDashboard;
