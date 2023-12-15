import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getReactNativePersistence, initializeAuth } from 'firebase/auth/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from 'firebase/firestore'
import { Platform } from "react-native";
import { API_KEY, AUTH_DOMAIN, DB_URL, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } from 'react-native-dotenv'

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DB_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
if (Platform.OS !== "web") {
  initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  })
}
const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db }