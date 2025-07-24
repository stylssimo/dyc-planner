import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface UserData {
  uid: string;
  name: string | null;
  email: string | null;
  picture: string | null;
  role: string;
  phoneNumber: string | null;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  setUser: (user: UserData | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'dyc_auth_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser && firebaseUser.email) {
        // User is signed in
        const userRef = doc(db, 'users', firebaseUser.email);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          // Create user document if it doesn't exist
          await setDoc(userRef, {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            picture: firebaseUser.photoURL,
            role: 'user',
            createdAt: new Date().toISOString(),
            phoneNumber: docSnap.data()?.profile?.personalInfo?.phoneNumber || "",
          });
        }

        const role = docSnap.exists() ? docSnap.data().role : 'user';
        const userData: UserData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          picture: firebaseUser.photoURL,
          phoneNumber: docSnap.data()?.profile?.personalInfo?.phoneNumber || "",
          role,
        };

        setUser(userData);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const contextValue: AuthContextType = {
    user,
    loading,
    setUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 