import { ordersCollection } from '@/firebase'
import { useAuth } from '@/providers/authProvider'
import { useOrdersStore } from '@/providers/ordersStore'
import { Order } from '@/typing'
import { onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useOrders = () => {
   const [orders, setOrders] = useState<Order[]>([])
   const [loading, setLoading] = useState(false)
   const storeOrder = useOrdersStore((s) => s.setOrders)
   const user = useAuth().user

   useEffect(() => {
      if (!user) return
      const q = query(ordersCollection, where('courier.id', '==', user?.id))
      return onSnapshot(q, (snap) => {
         const data = snap.docs.map((d) => d.data() as Order)
         setOrders(data)
         storeOrder(data)
         setLoading(false)
      })
   }, [user])

   return { orders, loading }
}
