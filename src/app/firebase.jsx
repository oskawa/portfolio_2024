import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyBsUc8FkQDblTNr-X1GWPHXHjQMBMCKHbc",
  authDomain: "visite-virtuelle-aea85.firebaseapp.com",
  databaseURL:
    "https://visite-virtuelle-aea85-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "visite-virtuelle-aea85",
  storageBucket: "visite-virtuelle-aea85.firebasestorage.app",
  messagingSenderId: "740577465881",
  appId: "1:740577465881:web:7f273b8a07ba2ee36bbc88",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, onValue };