import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLZAob8u6b7EsvjWxVbRJ1XrWx15bEOI8",
  authDomain: "itapp-ecc12.firebaseapp.com",
  projectId: "itapp-ecc12",
  storageBucket: "itapp-ecc12.firebasestorage.app",
  messagingSenderId: "1012802559882",
  appId: "1:1012802559882:web:c4fcf21605598b0bb33273"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Authentication (Login/Register)
export const auth = getAuth(app);

// 🗄️ Firestore Database (for reports, classes, etc.)
export const db = getFirestore(app);