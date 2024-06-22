import { Order } from '@/typing';

import * as Location from 'expo-location';
import { calculateDistance } from './calculateDistance';

export const sortOrderByDistance = async (orders: Order[]): Promise<Order[]> => {
  const sortedOrders: Order[] = [];
  try {
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({});

    orders.forEach((order) => {
      const distance = calculateDistance({ latitude, longitude }, order.address?.coords!);

      sortedOrders.push({ ...order, distance: distance });
    });

    return sortedOrders;
  } catch (error) {
    return [];
  }
};
