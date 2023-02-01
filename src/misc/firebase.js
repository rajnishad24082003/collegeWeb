import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9jlVoSiVrtgmM-RX1rmLwKu18xtLSrZg",
  authDomain: "college-web-61dc1.firebaseapp.com",
  projectId: "college-web-61dc1",
  storageBucket: "college-web-61dc1.appspot.com",
  messagingSenderId: "461630060610",
  appId: "1:461630060610:web:04ef84a80a8a65258ad5db",
  measurementId: "G-95FM2PHLJN",
  databaseURL: "https://college-web-61dc1-default-rtdb.asia-southeast1.firebasedatabase.app"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);



