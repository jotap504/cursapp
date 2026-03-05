import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDwfjgF3tVIHlT9jhGqmb2-bNr_St0q1dI",
    authDomain: "cursarapp-c5801.firebaseapp.com",
    databaseURL: "https://cursarapp-c5801-default-rtdb.firebaseio.com",
    projectId: "cursarapp-c5801",
    storageBucket: "cursarapp-c5801.firebasestorage.app",
    messagingSenderId: "872886390757",
    appId: "1:872886390757:web:13d67a5b9a6a3e6c4d290c",
    measurementId: "G-8CGCQ9THL3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

