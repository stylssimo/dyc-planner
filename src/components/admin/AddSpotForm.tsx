import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const AddSpotForm = ({ tripId, onChange }: { tripId: string; onChange: () => void }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddSpot = async () => {
        if (!name || !description) return;
        try {
            setLoading(true);
            await addDoc(collection(db, 'spots'), {
                tripId,
                name,
                description,
                createdAt: Date.now(),
            });
            setName('');
            setDescription('');
            onChange();
        } catch (err) {
            console.error('Error adding spot:', err);
            alert('❌ Failed to add spot');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <h4 className="text-sm font-medium">Add Spot</h4>
            <input
                className="border px-2 py-1 text-sm w-full mt-1"
                placeholder="Spot name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="border px-2 py-1 text-sm w-full mt-1"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button
                className="bg-blue-600 text-white px-4 py-1 text-sm mt-2 rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={handleAddSpot}
                disabled={loading}
            >
                {loading ? 'Adding...' : 'Add Spot'}
            </button>
        </div>
    );
};

export default AddSpotForm;
