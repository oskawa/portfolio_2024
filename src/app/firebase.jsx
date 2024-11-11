import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN;
const DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const STORAGE_BUCKET = process.env.NEXT_PUBLIC_STORAGE;
const MESSAGING = process.env.NEXT_PUBLIC_MESSAGING;
const APP_ID = process.env.NEXT_PUBLIC_APP_ID;



const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL:
  DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING,
  appId: APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, onValue };