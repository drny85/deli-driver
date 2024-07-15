import { MapViewDirectionsMode } from 'react-native-maps-directions'

export type Coords = {
   latitude: number
   longitude: number
}

export type OrderStatus =
   | 'Cancelled'
   | 'Ready For Delivery'
   | 'Order Received'
   | 'Processing'
   | 'Picked By Courier'
   | 'Accepted By Courier'
   | 'Delivered'

export enum ORDER_STATUS {
   new = 'new',
   delivered = 'delivered',
   in_progress = 'in_progress',
   marked_ready_for_delivery = 'marked_ready_for_delivery',
   marked_ready_for_pickup = 'marked_ready_for_pickup',
   cancelled = 'cancelled',
   accepted_by_driver = 'accepted_by_driver',
   picked_up_by_driver = 'picked_up_by_driver',
   picked_up_by_client = 'picked_up_by_client',
   all = 'all orders'
}

export const statusList: OrderStatus[] = [
   'Order Received',
   'Processing',
   'Accepted By Courier',
   'Picked By Courier',
   'Delivered'
]

export interface Order {
   id?: string
   orderNumber?: number
   mode: 'live' | 'test'
   total: number
   // items: CartItem[];
   paymentIntent: string
   orderDate: string
   userId: string
   businessId: string
   contactPerson: ContactPerson
   orderType: ORDER_TYPE
   deliveryInstructions: string | null
   address: OrderAddress | null
   status: ORDER_STATUS
   courier?: Courier | null
   deliveredOn?: string | null
   deliveredBy: Courier | null
   pickedUpOn?: string | null
   acceptedOn?: string | null
   pickedByCourierOn?: string
   declined: string[]
   tip?: Tip
   pickupCoords?: Coords
   deliveryPaid: boolean
   transferId: string | null
   otpPickup?: number | null
   distance?: number
}

export enum ORDER_TYPE {
   pickup = 'pickup',
   delivery = 'delivery'
}
export interface OrderAddress {
   street: string
   apt?: string
   coords: Coords
   addedOn: string
}

export interface ContactPerson {
   name: string
   lastName: string
   phone: string
}

export interface Tip {
   amount: number
   percentage: number
}

export interface Courier extends AppUser {
   transportation?: MapViewDirectionsMode
   stripeAccount: string | null
   stripe_temp_account?: string
   isOnline: boolean
   isActive: boolean
   busy?: boolean
   lastPictureChange?: string
   overridingPicture?: boolean
   agreement?: string[]
   phoneNumberVerified: boolean
}

export interface AppUser {
   id?: string
   name: string
   lastName: string
   email: string
   emailVerified: boolean
   phone: string | null
   type: 'admin' | 'business' | 'consumer' | 'courier'
   pushToken?: string
   image?: string
   coords: Coords | null
   status?: 'pending' | 'completed'
   favoritesStores: string[]
   deliveryAddresses: string | []
   provider: 'email' | 'apple' | 'google'
   createdAt: string
}

export type CustomUser = {
   id: string
   email: string
   displayName?: string | null
   isEmailVerified: boolean
}

export interface Business {
   id?: string
   name: string
   email: string
   mode: 'live' | 'test'
   owner: { name: string; lastName: string }
   stripeAccount: string | null
   address: string | null
   coords: Coords | null
   phone: string | null
   isActive: boolean
   userId: string
   tempStripeAccount?: string
   profileCompleted: boolean
   hasItems: boolean
   image: string | null
   hours: BusinessDay | null
   charges_enabled: boolean
   minimumDelivery: number | null
   orderType?: BUSINESS_ORDER_TYPE
   isOpen: boolean
   distance?: number | null
   eta?: number
   zips: number[]
   lastClosed?: string
   lastOpened?: string
   createdAt: string
   requiredOTPForPickup?: boolean
   couriers: string[]
   otpOverride?: number | null
}

export interface BusinessDay {
   [key: string]: Day
}

export type StoreCourierData = {
   id?: string
   businessId: string
   courierId: string
   status: 'pending' | 'completed' | 'inactive'
   name: string
   submittedOn: string
   phone: string
}

interface Day {
   openAt: string
   closeAt: string
}
export enum BUSINESS_ORDER_TYPE {
   deliveryOnly = 'deliveryOnly',
   both = 'both'
}

export type PaymentIntentParams = {
   paymentIntentId: string
   paymentIntent: string
   ephemeralKey: string
   customer: string
   env?: string
}

export type ConnectedAccountParams = {
   businessName: string
   phone: string
   address?: string
   name: string
   lastName: string
   type: 'business' | 'courier'
   mode?: 'live' | 'test' | undefined
}

export interface StripeResponse {
   success: boolean
   result: string | null
}
