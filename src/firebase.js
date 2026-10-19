import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBlAh9BZEn7dSGddSU_v10hgTexVGzK4sQ",
  authDomain: "weare-f6945.firebaseapp.com",
  projectId: "weare-f6945",
  storageBucket: "weare-f6945.firebasestorage.app",
  messagingSenderId: "672385073633",
  appId: "1:672385073633:web:e436cab03eb202781b52a0",
  measurementId: "G-PSBGYNWXJ8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
