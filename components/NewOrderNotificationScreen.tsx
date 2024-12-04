import { View, Text } from 'react-native'
import React from 'react'
import { useOrdersStore } from '@/providers/ordersStore'
import { Button } from './Button'
import { router } from 'expo-router'

type Props = {
   orderId: string
   onClose: () => void
}

const NewOrderNotificationScreen = ({ orderId, onClose }: Props) => {
   const getOrder = useOrdersStore((s) => s.getOrder)
   const order = getOrder(orderId)

   if (!order) return null
   return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, gap: 30 }}>
         <Text style={{ fontSize: 20, fontWeight: '600', marginVertical: 12 }}>New Delivery</Text>
         <Text style={{ fontSize: 30, fontWeight: '700' }}>Order #: {order.orderNumber}</Text>
         <View style={{ padding: 10, gap: 8 }}>
            <Text style={{ fontSize: 20 }}>Tip: ${order.tip?.amount.toFixed(2)}</Text>
            <Text style={{ fontSize: 16 }}>
               Customer: {order.contactPerson.name} {order.contactPerson.lastName}
            </Text>
            <Text style={{ fontSize: 16 }}>{order.address?.street}</Text>
         </View>
         <Button
            title="View Delivery"
            contentTextStyle={{ paddingHorizontal: 28 }}
            onPress={() => {
               onClose()
               router.push({ pathname: '/maps', params: { orderId: order.id } })
            }}
         />
      </View>
   )
}

export default NewOrderNotificationScreen
