import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { useOrdersStore } from '@/providers/ordersStore'
import { findUndeliveredOrder } from '@/utils/getNextClosestOrder'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import { Colors, SIZES } from '@/constants/Colors'
import { Order, ORDER_STATUS } from '@/typing'
import { useAuth } from '@/providers/authProvider'
import Row from '@/components/Row'
import { Feather } from '@expo/vector-icons'
import Loading from '@/components/Loading'

const NextOrder = () => {
   const { user } = useAuth()
   const orders = useOrdersStore((s) => s.orders)
   const moreOrders = orders.filter((order) => order.status === ORDER_STATUS.accepted_by_driver)
   const [nextOrder, setNextOrder] = useState<Order | null>(null)

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
         setNextOrder(nextOrder)

         // router.push({ pathname: '/maps', params: { orderId: nextOrder?.id } })
      } catch (error) {
         console.log(error)
      }
   }, [orders, moreOrders])

   const goToNextOrder = () => {
      if (!nextOrder) return

      router.push({ pathname: '/maps', params: { orderId: nextOrder?.id } })
   }

   useEffect(() => {
      if (moreOrders.length === 0) {
         router.replace('/(app)/(tabs)')
      }
   }, [moreOrders])

   useEffect(() => {
      handleNextOrder()
   }, [])

   if (!nextOrder) return <Loading />

   return (
      <Container>
         <View style={styles.container}>
            <Text style={styles.title}>
               Great going {user?.name} you only have {moreOrders.length}{' '}
               {moreOrders.length === 1 ? 'delivery' : 'deliveries'} remaining
            </Text>
            <Text style={styles.bigTitle}>Order # {nextOrder?.orderNumber}</Text>
            <View style={styles.innerView}>
               <Text style={[styles.text, { textAlign: 'center', fontSize: 22, fontWeight: 600 }]}>
                  Your next delivery address is
               </Text>
               <Text style={styles.text}>{nextOrder?.address?.street}</Text>
            </View>
            <Row containerStyle={{ justifyContent: 'space-between' }}>
               <TouchableOpacity style={styles.button} onPress={() => router.push('/(app)/(tabs)')}>
                  <Feather name="chevron-left" size={28} color={Colors.main} />
                  <Text style={styles.buttonText}>All Orders</Text>
               </TouchableOpacity>
               {moreOrders.length > 0 && (
                  <TouchableOpacity style={styles.button} onPress={goToNextOrder}>
                     <Text style={styles.buttonText}>Take Next</Text>
                     <Feather name="chevron-right" size={28} color={Colors.main} />
                  </TouchableOpacity>
               )}
            </Row>
         </View>
      </Container>
   )
}

export default NextOrder

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: SIZES.md,
      gap: SIZES.md,
      justifyContent: 'space-between'
   },
   bigTitle: {
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center'
   },
   title: {
      fontSize: 24,
      fontWeight: '500',
      color: 'black'
   },
   innerView: {
      backgroundColor: Colors.primary,
      padding: SIZES.md,
      borderRadius: 10,
      gap: SIZES.sm
   },
   text: {
      fontSize: 18,

      color: 'black'
   },
   buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.main
   },
   button: {
      backgroundColor: 'white',
      padding: SIZES.sm,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: SIZES.sm,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)'
   }
})
