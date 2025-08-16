import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { AuthState, User } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  const generateSessionId = () => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Demo login bypass
      if (email === 'demo@agent.com' && password === 'demo123') {
        const demoUser: User = {
          uid: 'demo-user-id',
          email: 'demo@agent.com',
          displayName: 'Demo Agent',
          lastLogin: new Date(),
          sessionId: generateSessionId()
        };
        
        setAuthState({
          user: demoUser,
          loading: false,
          error: null
        });
        
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const sessionId = generateSessionId();
      
      // Check for existing sessions and handle single session rule
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || 'Agent',
        lastLogin: new Date(),
        sessionId
      };

      // Update user session in Firestore
      await setDoc(userDocRef, {
        ...userData,
        lastLogin: serverTimestamp(),
        sessionId
      }, { merge: true });

      setAuthState({
        user: userData,
        loading: false,
        error: null
      });

    } catch (error: any) {
      setAuthState({
        user: null,
        loading: false,
        error: error.message
      });
    }
  };

  const logout = async () => {
    try {
      if (authState.user?.uid.startsWith('demo')) {
        localStorage.removeItem('currentUser');
        setAuthState({
          user: null,
          loading: false,
          error: null
        });
        return;
      }
      
      await signOut(auth);
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    // Check for demo user in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.uid === 'demo-user-id') {
        setAuthState({
          user,
          loading: false,
          error: null
        });
        return;
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Listen for session changes
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        const unsubscribeDoc = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            const user: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || userData.displayName || 'Agent',
              lastLogin: userData.lastLogin?.toDate() || new Date(),
              sessionId: userData.sessionId || ''
            };

            // Check if current session is still valid
            const currentSessionId = authState.user?.sessionId;
            if (currentSessionId && userData.sessionId !== currentSessionId) {
              // Session has been invalidated by another login
              signOut(auth);
              return;
            }

            setAuthState({
              user,
              loading: false,
              error: null
            });
          }
        });

        return () => unsubscribeDoc();
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null
        });
      }
    });

    return () => unsubscribe();
  }, [authState.user?.sessionId]);

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout
  };
};