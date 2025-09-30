// src/firebaseConfig.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  Auth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  enableIndexedDbPersistence,
  Firestore,
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFunctions, Functions } from "firebase/functions";
import { getMessaging, Messaging } from "firebase/messaging";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Replace these values with your Firebase console config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};

// Initialize app (avoid duplicate initialization)
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Init / export Auth with React Native persistence (safe for Fast Refresh)
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e: any) {
  // If already initialized (fast refresh), fallback
  auth = getAuth(app);
}

// Firestore with graceful offline persistence setup
const db: Firestore = getFirestore(app);
try {
  enableIndexedDbPersistence(db).catch((err) => {
    // IndexedDB persistence is web-only — keep a non-fatal warning
    console.warn("⚠️ Firestore persistence not available:", err?.code || err);
  });
} catch (err) {
  console.warn("⚠️ Firestore persistence init failed:", err);
}

// Storage, Functions, Messaging, Analytics
const storage: FirebaseStorage = getStorage(app);
let functions: Functions | null = null;
try {
  functions = getFunctions(app);
} catch {
  functions = null;
}

let messaging: Messaging | null = null;
try {
  messaging = getMessaging(app);
} catch {
  messaging = null;
}

let analytics: Analytics | null = null;
isSupported().then((ok) => {
  if (ok) analytics = getAnalytics(app);
});

// Export everything
export { app, auth, db, storage, functions, messaging, analytics };
export default app;
