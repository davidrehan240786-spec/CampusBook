console.log("ENV CHECK:", import.meta.env);
console.log("API KEY:", import.meta.env.VITE_FIREBASE_API_KEY);
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase Configuration Placeholders - Replace with your real keys from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseId: "(default)"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app, firebaseConfig.databaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Check if configuration is using placeholders
export const isConfigured =
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.projectId;

// Connection test as required by instructions
async function testConnection() {
  if (!isConfigured) {
    console.warn("Firebase is in placeholder mode. Real-time chat features will be disabled until valid credentials are added to src/lib/firebase.ts or environment variables.");
    return;
  }

  try {
    // Attempting to read a dummy doc to verify connection
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connected successfully.");
  } catch (error) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('permission-denied'))) {
      console.error("Firebase Connection Issue: Please check your configuration keys and security rules.");
    }
  }
}

testConnection();
