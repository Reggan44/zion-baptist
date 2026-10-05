import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

// Firebase config is loaded from environment variables (see .env.local).
// These keys are intentionally public — security is enforced via Firestore Security Rules.
// See: https://firebase.google.com/docs/projects/api-keys
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

// Public VAPID Key for FCM
export const VAPID_KEY = "BKtE27i4SFqKpVymxWFHrPQud1q3lOpuOVKBsBgXdx8rDWnR5hUtzK5E0pDkwUjKwGDOKN3GFd63EW_fur4nKMI";

// Use session storage persistence so admin sessions expire when the browser tab closes.
// This is a security measure to prevent session hijacking on shared computers.
setPersistence(auth, browserSessionPersistence).catch(console.error);
