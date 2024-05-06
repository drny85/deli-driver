import { auth } from '@/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';

// Define custom user type
interface CustomUser {
  id: string;
  email: string;
  displayName?: string | null;
  isEmailVerified: boolean;
}

// Define types for AuthContext
interface AuthContextType {
  user: CustomUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
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
  const [user, setUser] = useState<CustomUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      if (newUser) {
        setUser({
          id: newUser.uid,
          email: newUser.email || '',
          displayName: newUser.displayName,
          isEmailVerified: newUser.emailVerified,
        });
      } else {
        setUser(null);
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
      //   await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      //   await auth().signOut();
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
    signOut,
    resetPasswordEmail,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
