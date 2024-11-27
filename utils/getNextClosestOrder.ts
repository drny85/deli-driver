import { Coords, Order, ORDER_STATUS } from '@/typing'
import { calculateDistance } from './calculateDistance'

export function findUndeliveredOrder(orders: Order[], currentLocation: Coords): Order | null {
   let closestUndeliveredOrder: Order | null = null
   let closestDistance = Infinity

   orders.forEach((order) => {
      if (order.status !== ORDER_STATUS.delivered) {
         const distance = calculateDistance(currentLocation, order.address?.coords!)
         if (distance < closestDistance) {
            closestDistance = distance
            closestUndeliveredOrder = { ...order, distance }
         }
      }
   })

   return closestUndeliveredOrder
}

// Example usage
