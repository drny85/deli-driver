import { auth, usersCollection } from '@/firebase';
import { AppUser, CustomUser } from '@/typing';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';

// Define custom user type

// Define types for AuthContext
interface AuthContextType {
  user: AppUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPasswordEmail: (email: string) => Promise<void>;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
      try {
        if (newUser) {
          const userDoc = doc(usersCollection, newUser.uid);
          const data = await getDoc(userDoc);
          if (!data.exists()) {
            setUser(null);
            return;
          }
          setUser({ ...data.data(), emailVerified: newUser.emailVerified });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log('Error on authchanged', error);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(user);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const resetPasswordEmail = async (email: string) => {
    try {
      //   await auth().sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const authContextValue: AuthContextType = {
    user,
    signIn,
    signUp,
    logOut,
    resetPasswordEmail,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
