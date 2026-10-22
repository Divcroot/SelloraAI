import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "selloraai-bfba1.firebaseapp.com",
  projectId: "selloraai-bfba1",
  storageBucket: "selloraai-bfba1.firebasestorage.app",
  messagingSenderId: "971144873406",
  appId: "1:971144873406:web:21baf5ab278c8b958925ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };