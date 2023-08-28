import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore"; // Import the Firestore service
import { getAuth } from "firebase/auth"; // Import the Auth service

const firebaseConfig = {
  apiKey: "AIzaSyCsTbw_sHHZmIc7Zje4lbV-piNon3-RDSk",
  authDomain: "dikda-3b694.firebaseapp.com",
  databaseURL: "https://dikda-3b694-default-rtdb.firebaseio.com",
  projectId: "dikda-3b694",
  storageBucket: "dikda-3b694.appspot.com",
  messagingSenderId: "1058382920934",
  appId: "1:1058382920934:web:18fca323a0f1a2f38c4f27",
  measurementId: "G-GTG8H2JHSM",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, storage, database, firestore, auth };
