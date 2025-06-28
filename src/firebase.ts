import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCS_w2K-nJ39mTM1C73jhXBMVxyqc8B4uc",
    authDomain: "dyc-planner.firebaseapp.com",
    projectId: "dyc-planner",
    storageBucket: "dyc-planner.firebasestorage.app",
    messagingSenderId: "862962507182",
    appId: "1:862962507182:web:be5a5c83b7fc9c7bc53c3f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);