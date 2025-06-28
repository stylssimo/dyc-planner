// src/components/SearchBar.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface SearchBarProps {
    isLoggedIn: boolean;
    loggedInUser: string | null;
    onLoginClick: () => void; // Callback to open login modal
    onLogout: () => void; // Callback to handle logout
}

const SearchBar: React.FC<SearchBarProps> = ({ isLoggedIn, loggedInUser, onLoginClick, onLogout }) => {
    const { t } = useTranslation(); // Initialize useTranslation hook

    const [destination, setDestination] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');

    const validatePhoneNumber = (number: string) => {
        const digitsOnly = number.replace(/\D/g, '');
        if (!number) {
            setPhoneError(t('searchBar.phoneRequired')); // Use translation
            return false;
        } else if (digitsOnly.length !== 8) {
            setPhoneError(t('searchBar.phoneLengthError')); // Use translation
            return false;
        }
        setPhoneError('');
        return true;
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError(t('searchBar.emailRequired')); // Use translation
            return false;
        } else if (!emailRegex.test(email)) {
            setEmailError(t('searchBar.emailInvalid')); // Use translation
            return false;
        }
        setEmailError('');
        return true;
    };

    const handleCustomizeClick = () => {
        if (isLoggedIn) {
            alert(t('searchBar.alreadyLoggedIn', { user: loggedInUser })); // Use translation
            console.log('Destination:', destination);
            console.log('Phone Number:', phoneNumber);
            console.log('Email:', email);
            return;
        }

        const isPhoneValid = validatePhoneNumber(phoneNumber);
        const isEmailValid = validateEmail(email);

        if (isPhoneValid && isEmailValid) {
            onLoginClick();
            console.log('Validation passed. Requesting login modal...');
        } else {
            console.log('Validation failed. Please check your inputs.');
        }
    };

    return (
        <div className="bg-white shadow-lg -mt-12 z-20 relative max-w-5xl mx-auto rounded-xl p-6 flex flex-col items-center">
            <p className="text-lg text-gray-700 mb-6 w-full text-left">
                {t('searchBar.introText')} {/* Use translation */}
            </p>
            <div className="flex flex-col md:flex-row gap-4 w-full mb-6">
                {/* Destination Dropdown */}
                <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="border border-gray-300 p-3 rounded-md flex-grow appearance-none bg-white pr-8"
                >
                    <option value="">{t('searchBar.selectDestination')}</option> {/* Use translation */}
                    <option value="Thailand">{t('destinations.thailand')}</option>
                    <option value="Vietnam">{t('destinations.vietnam')}</option>
                    <option value="Europe">{t('destinations.europe')}</option>
                    <option value="Turkey">{t('destinations.turkey')}</option>
                </select>

                {/* Phone Number Input with 8-digit Validation */}
                <div className="relative flex-grow">
                    <input
                        type="tel"
                        placeholder={t('searchBar.phonePlaceholder')} // Changed comment to JavaScript style
                        className={`border ${phoneError ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md w-full`}
                        value={phoneNumber}
                        onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            if (phoneError) validatePhoneNumber(e.target.value);
                        }}
                        onBlur={() => validatePhoneNumber(phoneNumber)}
                    />
                    {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                </div>

                {/* Email Input with Validation */}
                <div className="relative flex-grow">
                    <input
                        type="email"
                        placeholder={t('searchBar.emailPlaceholder')} // Changed comment to JavaScript style
                        className={`border ${emailError ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md w-full`}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) validateEmail(e.target.value);
                        }}
                        onBlur={() => validateEmail(email)}
                    />
                    {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                </div>

                {isLoggedIn ? (
                    <button
                        onClick={onLogout}
                        className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 flex-shrink-0"
                    >
                        {t('searchBar.logoutButton', { user: loggedInUser })} {/* Use translation */}
                    </button>
                ) : (
                    <button
                        onClick={handleCustomizeClick}
                        className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 flex-shrink-0"
                    >
                        {t('searchBar.customizeTripButton')} {/* Use translation */}
                    </button>
                )}
            </div>
            {/* Display logged-in status message */}
            {isLoggedIn && (
                <p className="text-green-600 text-lg mb-4 w-full text-center">
                    {t('searchBar.loggedInStatus', { user: loggedInUser })} {/* Use translation */}
                </p>
            )}
        </div>
    );
};

export default SearchBar;