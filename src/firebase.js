// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

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

const app = initializeApp(firebaseConfig);

// Export for Realtime DB (if you use it)
export const db = getDatabase(app); 

// Export for Firestore, which your HarassmentDetector uses
export const firestore = getFirestore(app);