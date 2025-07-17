// src/firebase-config.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD8DCOwWFYMvTbJ53g0lnUlCCNWdU9gZZk",
  authDomain: "vantaai-69cd3.firebaseapp.com",
  databaseURL: "https://vantaai-69cd3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vantaai-69cd3",
  storageBucket: "vantaai-69cd3.appspot.com",
  messagingSenderId: "752610987352",
  appId: "1:752610987352:web:b0d1cf77cabdddb4b3e92d",
  measurementId: "G-NJ0KRRP1J5"
};

// Hot-reload safe initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// --- We are EXPORTING 'firestore' here ---
export const auth = getAuth(app);
export const firestore = getFirestore(app); // This line makes the import work
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);