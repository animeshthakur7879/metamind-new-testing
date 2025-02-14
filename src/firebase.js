import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase Config (Replace with your own)
const firebaseConfig = {
    apiKey: "AIzaSyD1CiB-fvSURee9z8Ny8YSVjIAmjDS8QNU",
    authDomain: "metamind-d2af4.firebaseapp.com",
    projectId: "metamind-d2af4",
    storageBucket: "metamind-d2af4.firebasestorage.app",
    messagingSenderId: "453524877180",
    appId: "1:453524877180:web:548de83a96744dbb08fef9",
    measurementId: "G-ZX98Q7R5K5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };