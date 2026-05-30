import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXK7cpXSDgEq7MhKVantwNSCHhPCwvTXk",
  authDomain: "deepfake-detector-3543f.firebaseapp.com",
  projectId: "deepfake-detector-3543f",
  storageBucket: "deepfake-detector-3543f.firebasestorage.app",
  messagingSenderId: "1000535969000",
  appId: "1:1000535969000:web:bd84a49788a9bd9ba3cd5d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);