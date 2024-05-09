import { usersCollection } from '@/firebase';
import { Courier } from '@/typing';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

export const createCourier = async (userId: string, email: string, phone: string) => {
  try {
    const newCourier: Courier = {
      name: '',
      coords: null,
      createdAt: new Date().toISOString(),
      email,
      emailVerified: false,
      isActive: false,
      isOnline: false,
      phone,
      stripeAccount: null,
      lastName: '',
      busy: false,
      provider: 'email',
      image: '',
      deliveryAddresses: [],
      type: 'courier',
      favoritesStores: [],
      phoneNumberVerified: false,
    };

    const docRef = doc(usersCollection, userId);
    await setDoc(docRef, { ...newCourier });
  } catch (error) {
    console.log('Error adding courier', error);
  }
};

export const updateCourier = async (courier: Courier): Promise<boolean> => {
  try {
    if (!courier.id) return false;
    const courierRef = doc(usersCollection, courier.id);
    await updateDoc(courierRef, { ...courier });
    return true;
  } catch (error) {
    console.log('Error updating courier', error);
    return false;
  }
};
