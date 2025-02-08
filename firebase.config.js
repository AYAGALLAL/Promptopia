// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4Wo_I0-w8xF2ijIo3PqUQ7LmkZj8Bd9E",
  authDomain: "promptopia-39b85.firebaseapp.com",
  projectId: "promptopia-39b85",
  storageBucket: "promptopia-39b85.firebasestorage.app",
  messagingSenderId: "543074704166",
  appId: "1:543074704166:web:9b7ddeaf9cca21d42cbfe7",
  measurementId: "G-K8MEHSMPTY"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signOut };