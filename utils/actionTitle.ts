import { OrderStatus } from '@/typing';

export const actionTitle = (status: OrderStatus): string => {
  return status === 'Ready For Delivery'
    ? 'Add To Trip'
    : status === 'Accepted By Courier'
      ? 'Pick Up Order'
      : status === 'Picked By Courier'
        ? 'Deliver Order'
        : 'Complete';
};
