import { createCourier } from '@/actions/user/createCourier';
import { auth, usersCollection } from '@/firebase';
import { AppUser, Courier } from '@/typing';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { set } from 'react-hook-form';

// Define custom user type

// Define types for AuthContext
interface AuthContextType {
  user: Courier | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, phone: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPasswordEmail: (email: string) => Promise<void>;
  setUser: (user: Courier) => void;
  updateUser: (newUser: Courier) => Promise<void>;
  loading: boolean;
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
  const [user, setUser] = useState<Courier | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
      try {
        if (newUser) {
          setLoading(true);
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
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('USER AT SIGN IN', user?.email);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, phone: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      if (user) {
        await createCourier(user.uid, email, phone);
        await sendEmailVerification(user);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const updateUser = async (newUser: Courier) => {
    try {
      const userDoc = doc(usersCollection, newUser.id);
      await updateDoc(userDoc, { ...newUser });
    } catch (error) {
      console.error('Update user error:', error);
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
    setUser,
    loading,
    updateUser,
    resetPasswordEmail,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
