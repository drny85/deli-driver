import { auth, usersCollection } from '@/firebase';
import { AppUser } from '@/typing';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export const useUser = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  useEffect(() => {
    if (!auth.currentUser) {
      setUser(null);
      return;
    }
    const userRef = doc(usersCollection, auth.currentUser.uid);
    return onSnapshot(userRef, (snap) => {
      if (!snap.exists()) return;
      setUser({ ...snap.data(), emailVerified: auth.currentUser?.emailVerified! });
    });
  }, [auth.currentUser]);

  return { user };
};
