// frontend/services/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Note: We removed 'getAnalytics' because it is for websites only and will crash mobile apps.

// Your web app's Firebase configuration (Updated with your keys)
const firebaseConfig = {
  apiKey: "AIzaSyBLZAob8u6b7EsvjWxVbRJ1XrWx15bEOI8",
  authDomain: "itapp-ecc12.firebaseapp.com",
  projectId: "itapp-ecc12",
  storageBucket: "itapp-ecc12.firebasestorage.app",
  messagingSenderId: "1012802559882",
  appId: "1:1012802559882:web:c4fcf21605598b0bb33273",
  measurementId: "G-B3H6QFZ43E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and Export Services needed by your Screens
export const auth = getAuth(app);
export const db = getFirestore(app);