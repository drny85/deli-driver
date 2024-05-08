import { usersCollection } from '@/firebase';
import { Courier } from '@/typing';
import { doc, setDoc } from 'firebase/firestore';

export const createCourier = async (userId: string, email: string) => {
  try {
    const newCourier: Courier = {
      name: '',
      coords: null,
      createdAt: new Date().toISOString(),
      email,
      emailVerified: false,
      isActive: false,
      isOnline: false,
      phone: '',
      stripeAccount: null,
      lastName: '',
      busy: false,
      provider: 'email',
      image: '',
      deliveryAddresses: [],
      type: 'courier',
      favoritesStores: [],
    };

    const docRef = doc(usersCollection, userId);
    await setDoc(docRef, { ...newCourier });
  } catch (error) {
    console.log('Error adding courier', error);
  }
};
