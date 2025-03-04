
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBEmNG5Jb2XrKsK2cwkLbApYrCPDkKJmKc",
  authDomain: "bookmyservice-web.firebaseapp.com",
  projectId: "bookmyservice-web",
  storageBucket: "bookmyservice-web.firebasestorage.app",
  messagingSenderId: "310554152011",
  appId: "1:310554152011:web:b19642a79fe5faaf0c51ce",
  measurementId: "G-DBKN01CEMF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };