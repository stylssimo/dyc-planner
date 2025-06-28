import React, { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGoogleLoginSuccess: (userData: any) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
    isOpen,
    onClose,
    onGoogleLoginSuccess,
}) => {
    const [error, setError] = useState<string | null>(null);

    const handleFirebaseGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userData = {
                name: user.displayName,
                email: user.email,
                picture: user.photoURL,
                uid: user.uid,
                role: user.email === 'a.uuganbayar@gmail.com' ? 'admin' : 'user',
            };

            onGoogleLoginSuccess(userData);
            onClose();
        } catch (error) {
            console.error('Firebase Google login failed', error);
            setError('Google login failed. Please try again.');
        }
    };

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
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button
                    onClick={handleFirebaseGoogleLogin}
                    className="bg-white border px-4 py-2 mb-2 rounded-md hover:bg-gray-100 shadow-md w-full flex items-center justify-center"
                >
                    <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default LoginModal;
