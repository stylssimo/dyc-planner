import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const ProfilePage = () => {

    const { user } = useAuth();

    const updatePhoneNumber = async (phoneNumber: string) => {
        console.log(phoneNumber);
        const phoneNumberRef = doc(db, 'users', user?.email || '');
        await updateDoc(phoneNumberRef, {
            phoneNumber: phoneNumber
        });
    };

    return <div>
        <h1>Profile</h1>
        <p>{user?.email}</p>
        <button onClick={() => updatePhoneNumber(user?.phoneNumber || '')}>Update Phone Number</button>
    </div>;
};

export default ProfilePage;