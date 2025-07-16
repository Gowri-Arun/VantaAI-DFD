// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// You probably have this line for the core app
// You are likely MISSING this line for the database
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8DCOwWFYMvTbJ53g0lnUlCCNWdU9gZZk",
  authDomain: "vantaai-69cd3.firebaseapp.com",
  databaseURL: "https://vantaai-69cd3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vantaai-69cd3",
  storageBucket: "vantaai-69cd3.firebasestorage.app",
  messagingSenderId: "752610987352",
  appId: "1:752610987352:web:b0d1cf77cabdddb4b3e92d",
  measurementId: "G-NJ0KRRP1J5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getDatabase(app);