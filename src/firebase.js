

import { initializeApp } from 'firebase/app';
// REMOVE or keep the line below, we won't be using it for the chat
import { getDatabase } from 'firebase/database';
// ADD this line for Firestore
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // ... your config keys ...
  apiKey: "AIzaSyD8DCOwWFYMvTbJ53g0lnUlCCNWdU9gZZk",
  authDomain: "vantaai-69cd3.firebaseapp.com",
  databaseURL: "https://vantaai-69cd3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vantaai-69cd3",
  storageBucket: "vantaai-69cd3.firebasestorage.app",
  messagingSenderId: "752610987352",
  appId: "1:752610987352:web:b0d1cf77cabdddb4b3e92d",
  measurementId: "G-NJ0KRRP1J5"
};

const app = initializeApp(firebaseConfig);

// Keep this line if you use Realtime DB elsewhere, otherwise it can be removed
export const db = getDatabase(app); 

// ADD this line to export the Firestore instance
export const firestore = getFirestore(app);