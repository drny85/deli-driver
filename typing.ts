import { MapViewDirectionsMode } from 'react-native-maps-directions';

export type Coords = {
  latitude: number;
  longitude: number;
};

export type OrderStatus =
  | 'Order Received'
  | 'Processing'
  | 'Picked By Courier'
  | 'Accepted By Courier'
  | 'Delivered';
export const statusList: OrderStatus[] = [
  'Order Received',
  'Processing',
  'Accepted By Courier',
  'Picked By Courier',

  'Delivered',
];

export interface Order {
  id?: string;
  orderNumber?: number;
  mode: 'live' | 'test';
  total: number;
  // items: CartItem[];
  paymentIntent: string;
  orderDate: string;
  userId: string;
  businessId: string;
  contactPerson: ContactPerson;
  orderType: ORDER_TYPE;
  deliveryInstructions: string | null;
  address: OrderAddress | null;
  status: OrderStatus;
  courier?: Courier | null;
  deliveredOn?: string | null;
  deliveredBy: Courier | null;
  pickedUpOn?: string | null;
  acceptedOn?: string | null;
  pickedByCourierOn?: string;
  declined: string[];
  tip?: Tip;
  pickupCoords?: Coords;
  deliveryPaid: boolean;
  transferId: string | null;
  otpPickup?: number | null;
}
export type TempOrder = {
  id: string;
  destination: Coords;
  status: OrderStatus;
};

export enum ORDER_TYPE {
  pickup = 'pickup',
  delivery = 'delivery',
}
export interface OrderAddress {
  street: string;
  apt?: string;
  coords: Coords;
  addedOn: string;
}

export interface ContactPerson {
  name: string;
  lastName: string;
  phone: string;
}

export interface Tip {
  amount: number;
  percentage: number;
}

export interface Courier extends AppUser {
  transportation?: MapViewDirectionsMode;
  stripeAccount: string | null;
  stripe_temp_account?: string;
  isOnline: boolean;
  isActive: boolean;
  busy?: boolean;
  lastPictureChange?: string;
  overridingPicture?: boolean;
  agreement?: string[];
}

export interface AppUser {
  id?: string;
  name: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phone: string | null;
  type: 'admin' | 'business' | 'consumer' | 'courier';
  pushToken?: string;
  image?: string;
  coords: Coords | null;
  status?: 'pending' | 'completed';
  transportation?: MapViewDirectionsMode;
  favoritesStores: string[];
  deliveryAddresses: string | [];
  provider: 'email' | 'apple' | 'google';
  createdAt: string;
}
