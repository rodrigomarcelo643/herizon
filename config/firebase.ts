import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  updateDoc
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHUGQ8pvEAb4m3giIijKyrZbS-c7TAqtQ",
  authDomain: "herizon-9a5a7.firebaseapp.com",
  projectId: "herizon-9a5a7",
  storageBucket: "herizon-9a5a7.appspot.com",
  messagingSenderId: "802259428985",
  appId: "1:802259428985:web:e97554e7aa8d10a47416a8",
  measurementId: "G-NF0QJYJBJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


// Export the services for use in other files
export { 
  db, 
  auth, 
  storage,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  ref,
  uploadBytes,
  getDownloadURL
};