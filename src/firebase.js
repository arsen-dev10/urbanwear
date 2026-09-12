import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD03jLrZ42FTD2z2nYzZ5Irg20Qq-o9rlw',
  authDomain: 'project-60695.firebaseapp.com',
  projectId: 'project-60695',
  storageBucket: 'project-60695.firebasestorage.app',
  messagingSenderId: '110910931128',
  appId: '1:110910931128:web:d252eb78e9e6056002f44d',
  measurementId: 'G-WH4FZC47SY',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
