import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore"; // Import the Firestore service
import { getAuth } from "firebase/auth"; // Import the Auth service

const firebaseConfig = {
  apiKey: "AIzaSyCpGLg4g6c4YYFdvTc6gAVBJEot_D84rps",
  authDomain: "form-pppk.firebaseapp.com",
  databaseURL: "https://form-pppk-default-rtdb.firebaseio.com",
  projectId: "form-pppk",
  storageBucket: "form-pppk.appspot.com",
  messagingSenderId: "659185883804",
  appId: "1:659185883804:web:732a509adf3dc3fde6ab59",
  measurementId: "G-NGF5N8FS9D",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, storage, database, firestore, auth };
