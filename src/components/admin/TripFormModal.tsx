import { useEffect, useState } from 'react';
import TripForm from './TripForm';
import type { Trip } from '../../types/Trip';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (trip: Trip) => void;
    initialData?: Trip;
}

const TripFormModal = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
    const [formData, setFormData] = useState<Trip>({
        id: '',
        name: '',
        country: '',
        city: '',
        startDate: '',
        endDate: '',
        description: '',
        imageUrl: '',
        price: 0,
        isActive: true,
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    ✕
                </button>
                <h2 className="text-xl font-semibold mb-4">{initialData ? 'Edit Trip' : 'Create New Trip'}</h2>
                <TripForm formData={formData} setFormData={setFormData} onSubmit={onSubmit} />
            </div>
        </div>
    );
};

export default TripFormModal;
