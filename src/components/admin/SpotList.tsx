import { useEffect, useState } from 'react';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from 'firebase/firestore';
import { db } from '../../firebase';
import type { Spot } from '../../types/Spot';
import SpotFormModal from './SpotFormModal';

interface Props {
    tripId: string;
    onChange: () => void;
}

const SpotList = ({ tripId, onChange }: Props) => {
    const [spots, setSpots] = useState<Spot[]>([]);
    const [editingSpot, setEditingSpot] = useState<Spot | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchSpots = async () => {
        const q = query(collection(db, 'spots'), where('tripId', '==', tripId));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Spot[];
        setSpots(data);
    };

    useEffect(() => {
        fetchSpots();
    }, []);

    // const handleDelete = async (id: string) => {
    //     await deleteDoc(doc(db, 'spots', id));
    //     await fetchSpots();
    //     onChange();
    // };

    const handleEdit = (spot: Spot) => {
        setEditingSpot(spot);
        setShowModal(true);
    };

    const handleUpdate = () => {
        setShowModal(false);
        setEditingSpot(null);
        fetchSpots();
        onChange();
    };

    return (
        <div className="mt-2 space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Spots</h3>
            {spots.map((spot) => (
                <div
                    key={spot.id}
                    className="p-3 bg-gray-100 rounded-md flex justify-between items-center"
                >
                    <div>
                        <p className="font-semibold">{spot.name}</p>
                        <p className="text-xs text-gray-500">{spot.description}</p>
                    </div>
                    <div className="space-x-2">
                        <button
                            onClick={() => handleEdit(spot)}
                            className="text-xs px-2 py-1 bg-blue-500 text-white rounded"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                setDeleting(spot.id!);
                                deleteDoc(doc(db, 'spots', spot.id!)).then(() => {
                                    fetchSpots();
                                    onChange();
                                    setDeleting(null);
                                });
                            }}
                            disabled={deleting === spot.id}
                            className="text-xs px-2 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                        >
                            {deleting === spot.id ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            ))}

            {showModal && editingSpot && (
                <SpotFormModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleUpdate}
                    initialData={editingSpot}
                />
            )}
        </div>
    );
};

export default SpotList;
