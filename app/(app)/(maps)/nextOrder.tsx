import { View, Text } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { useOrdersStore } from '@/providers/ordersStore'
import { findUndeliveredOrder } from '@/utils/getNextClosestOrder'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import { SIZES } from '@/constants/Colors'
import { ORDER_STATUS } from '@/typing'

const NextOrder = () => {
   const orders = useOrdersStore((s) => s.orders)
   const moreOrders = orders.filter((order) => order.status === ORDER_STATUS.accepted_by_driver)

   const handleNextOrder = useCallback(async () => {
      if (moreOrders.length === 0) return
      try {
         const { coords } = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest
         })
         if (!coords) return

         const nextOrder = findUndeliveredOrder(moreOrders, {
            latitude: coords.latitude,
            longitude: coords.longitude
         })
         if (!nextOrder) return

         router.push({ pathname: '/maps', params: { orderId: nextOrder?.id } })
      } catch (error) {
         console.log(error)
      }
   }, [orders, moreOrders])

   useEffect(() => {
      if (moreOrders.length === 0) {
         router.replace('/(app)/(tabs)')
      }
   }, [moreOrders])

   return (
      <Container>
         <Text style={{ textAlign: 'center', fontSize: 20 }}>{moreOrders.length} remaining</Text>
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: SIZES.lg }}>
            <Text>nextOrder</Text>
            <Button title="All Orders" onPress={() => router.push('/(app)/(tabs)')} />
            {moreOrders.length > 0 && <Button title="Next Order" onPress={handleNextOrder} />}
         </View>
      </Container>
   )
}

export default NextOrder
