// firebase/firebase.js

// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDocs, getDoc, query, where, orderBy, updateDoc, deleteDoc, limit } 
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvYkFQ0KWvSpz9X4o-ht_-13LLiZRe0jM",
  authDomain: "glowmart-16b36.firebaseapp.com",
  projectId: "glowmart-16b36",
  storageBucket: "glowmart-16b36.firebasestorage.app",
  messagingSenderId: "863861686880",
  appId: "1:863861686880:web:210523eef6b1ba31fff905",
  measurementId: "G-7B2T1Z17SJ"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export Firestore functions for use in other files
export { collection, doc, setDoc, getDocs, getDoc, query, where, orderBy, updateDoc, deleteDoc, limit };

// Export Auth functions for use in other files
export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };
