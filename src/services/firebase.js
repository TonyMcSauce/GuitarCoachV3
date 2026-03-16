// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDaTPj6BO46SBBaN8tghu7KBip-oFwLbEk",
  authDomain: "guitarcoach-be5d0.firebaseapp.com",
  projectId: "guitarcoach-be5d0",
  storageBucket: "guitarcoach-be5d0.firebasestorage.app",
  messagingSenderId: "1053933981999",
  appId: "1:1053933981999:web:0329c7d5c9e6b9a43991da"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
