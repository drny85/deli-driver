import { Coords, TempOrder } from '@/typing';
import { calculateDistance } from './calculateDistance';

export function findUndeliveredOrder(
  orders: TempOrder[],
  currentLocation: Coords
): TempOrder | null {
  let closestUndeliveredOrder: TempOrder | null = null;
  let closestDistance = Infinity;

  orders.forEach((order) => {
    if (order.status !== 'Delivered') {
      const distance = calculateDistance(currentLocation, order.destination);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestUndeliveredOrder = { ...order, distance };
      }
    }
  });

  return closestUndeliveredOrder;
}

// Example usage
