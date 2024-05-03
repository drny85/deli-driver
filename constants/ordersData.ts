import { TempOrder } from '@/typing';

export const ordersData: TempOrder[] = [
  {
    id: '1',
    destination: { latitude: 40.83017, longitude: -73.91595 }, // New York
    status: 'Ready For Delivery',
  },
  {
    id: '2',
    destination: { latitude: 40.83399, longitude: -73.90537 }, // Los Angeles
    status: 'Delivered',
  },
  {
    id: '3',
    destination: { latitude: 40.81574, longitude: -73.91278 }, // London
    status: 'Ready For Delivery',
  },
  {
    id: '4',
    destination: { latitude: 40.82658, longitude: -73.90762 }, // London
    status: 'Accepted By Courier',
  },
  {
    id: '5',
    destination: { latitude: 40.833, longitude: -73.90109 }, // London
    status: 'Picked By Courier',
  },
  // Add more orders as needed
];
