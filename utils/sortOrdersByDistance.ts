import { TempOrder } from '@/typing';

import * as Location from 'expo-location';
import { calculateDistance } from './calculateDistance';

export const sortOrderByDistance = async (orders: TempOrder[]): Promise<TempOrder[]> => {
  const sortedOrders: TempOrder[] = [];
  try {
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({});

    orders.forEach((order) => {
      const distance = calculateDistance({ latitude, longitude }, order.destination);

      sortedOrders.push({ ...order, distance: distance });
    });

    return sortedOrders;
  } catch (error) {
    return [];
  }
};
