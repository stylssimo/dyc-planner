import React from 'react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean
    modalTitle: string
    modalDescription: string
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    modalTitle,
    modalDescription
}) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>
                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold mb-4 text-center">{modalTitle}</h2>
                    <p className="text-gray-600">{modalDescription}</p>
                </div>
                <button
                    onClick={onClose}
                    className="bg-white border px-4 py-2 mb-2 rounded-md hover:bg-gray-100 shadow-md w-full flex items-center justify-center"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="bg-white border px-4 py-2 mb-2 rounded-md hover:bg-gray-100 shadow-md w-full flex items-center justify-center border-red-500 text-red-500"
                >
                    {loading ? 'Deleting...' : 'Confirm'}
                </button>
            </div>
        </div>
    );
};

export default DeleteModal;
