import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC8pPQZqzN9RxRTEsMbowz2t1tEhEeSvWI",
  authDomain: "projectse-b0889.firebaseapp.com",
  projectId: "projectse-b0889",
  storageBucket: "projectse-b0889.firebasestorage.app",
  messagingSenderId: "396627854763",
  appId: "1:396627854763:web:9ffdca8e49ca28c3d2beee",
  measurementId: "G-KE2FZ5XPFN"
};

const app = initializeApp(firebaseConfig);

// Authentication
export const auth = getAuth(app);

// Firestore database
export const db = getFirestore(app);