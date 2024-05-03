import { Coords, Order, TempOrder } from '@/typing';

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
        closestUndeliveredOrder = order;
      }
    }
  });

  return closestUndeliveredOrder;
}

function calculateDistance(coords1: Coords, coords2: Coords): number {
  // This is a simple Euclidean distance calculation.
  const dx = coords1.latitude - coords2.latitude;
  const dy = coords1.longitude - coords2.longitude;
  return Math.sqrt(dx * dx + dy * dy);
}

// Example usage
