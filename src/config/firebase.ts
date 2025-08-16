// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Demo Firebase config - replace with your actual config in production
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "insurance-portal-demo.firebaseapp.com",
  projectId: "insurance-portal-demo",
  storageBucket: "insurance-portal-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
if (typeof window !== 'undefined' && !auth.app.options.apiKey?.includes('demo')) {
  // Only connect to emulator in development
  if (window.location.hostname === 'localhost') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099');
      connectFirestoreEmulator(db, 'localhost', 8080);
    } catch (error) {
      console.log('Emulator connection error:', error);
    }
  }
}

export default app;