import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
// import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { CollectionReference, DocumentData, collection, getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
console.log(
  'firebase',
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  Constants.expoConfig?.extra?.env.EXPO_PUBLIC_FIREBASE_API_KEY
);
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: Constants.expoConfig?.extra?.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: Constants.expoConfig?.extra?.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: Constants.expoConfig?.extra?.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: Constants.expoConfig?.extra?.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

console.log('firebaseConfig', JSON.stringify(Constants.expoConfig?.extra?.env, null, 2));

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

const storage = getStorage(app);

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export { auth, db, storage };
