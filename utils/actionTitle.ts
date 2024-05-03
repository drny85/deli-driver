import { OrderStatus } from '@/typing';

export const actionTitle = (status: OrderStatus): string => {
  return status === 'Ready For Delivery'
    ? 'Accept Order'
    : status === 'Accepted By Courier'
      ? 'Pick Up Order'
      : status === 'Picked By Courier'
        ? 'Deliver Order'
        : 'Complete';
};
