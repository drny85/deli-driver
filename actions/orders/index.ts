import { ordersCollection } from '@/firebase'
import { Order } from '@/typing'
import { doc, updateDoc } from 'firebase/firestore'

export const updateOrderInDatabase = async (order: Order): Promise<boolean> => {
   // update order in database
   try {
      if (!order) return false
      const orderRef = doc(ordersCollection, order.id)
      await updateDoc(orderRef, {
         ...order
      })

      return true
   } catch (error) {
      console.log('Error updating order', error)
      return false
   }
}
