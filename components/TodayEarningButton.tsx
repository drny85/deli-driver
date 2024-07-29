import { Text } from 'react-native'
import { useMemo } from 'react'
import NeoView from './NeoView'
import { useOrdersStore } from '@/providers/ordersStore'
import { ORDER_STATUS } from '@/typing'
import { SIZES } from '@/constants/Colors'
import { useAuth } from '@/providers/authProvider'

const TodayEarningButton = () => {
   const { user } = useAuth()
   const { orders } = useOrdersStore()
   const todayOrders = useMemo(() => {
      return orders
         .filter(
            (o) =>
               o.deliveredBy &&
               o.deliveredBy.id === user?.id &&
               o.status === ORDER_STATUS.delivered &&
               o.tip?.amount &&
               o.tip?.amount > 0
         )
         .filter((order) => {
            const orderDate = new Date(order.orderDate)
            const today = new Date()
            return (
               orderDate.getDate() === today.getDate() &&
               orderDate.getMonth() === today.getMonth() &&
               orderDate.getFullYear() === today.getFullYear()
            )
         })
         .reduce((acc, order) => acc + order.tip?.amount!, 0)
   }, [orders, user])

   console.log(todayOrders)
   return (
      <NeoView
         containerStyle={{ borderRadius: SIZES.lg * 3 }}
         outterContainerStyles={{ borderRadius: SIZES.lg * 3 }}>
         <Text
            style={{
               paddingHorizontal: SIZES.md * 2,
               paddingVertical: 5,
               fontWeight: '700',
               fontSize: 18
            }}>
            ${todayOrders.toFixed(2)}
         </Text>
      </NeoView>
   )
}

export default TodayEarningButton
