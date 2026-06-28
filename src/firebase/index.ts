import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_AufTMHA5YGHsQ1r71gM1M7d_vdT9eRI",
  authDomain: "tareeq-d4dcc.firebaseapp.com",
  projectId: "tareeq-d4dcc",
  storageBucket: "tareeq-d4dcc.firebasestorage.app",
  messagingSenderId: "725660784165",
  appId: "1:725660784165:web:56660a3b472dc6b07811cc",
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;