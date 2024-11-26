import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { Container } from '@/components/Container'
import { useLocalSearchParams } from 'expo-router'
import { useOrdersStore } from '@/providers/ordersStore'
import { Colors, SIZES } from '@/constants/Colors'
import { useBusiness } from '@/hooks/useBusiness'
import Loading from '@/components/Loading'
import { format, differenceInMinutes } from 'date-fns'

const DeliveryDetails = () => {
   const { id } = useLocalSearchParams<{ id: string }>()
   const order = useOrdersStore((s) => s.getOrder(id))
   const { business, loading } = useBusiness(order.businessId)

   if (!order)
      return (
         <Container>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
               <Text>Order not found</Text>
            </View>
         </Container>
      )

   if (loading) return <Loading />

   return (
      <Container>
         <Text style={styles.title}>Order's Details</Text>
         <ScrollView contentContainerStyle={{ padding: SIZES.md }}>
            <View style={{ gap: SIZES.sm }}>
               <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Order ID:</Text> {order.id}
               </Text>
               <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Order #:</Text> {order.orderNumber}
               </Text>

               <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Order Date:</Text>{' '}
                  {format(order.orderDate, 'PPpp')}
               </Text>

               <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Customer Name:</Text>{' '}
                  {order.contactPerson.name} {order.contactPerson.lastName}
               </Text>
               <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Delivery Address:</Text>{' '}
                  {order.address?.street}
               </Text>
               {order.address?.apt && (
                  <Text style={styles.text}>
                     <Text style={{ fontWeight: 'bold' }}>Customer Apt/Fl:</Text>{' '}
                     {order.address?.apt}
                  </Text>
               )}
               <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Customer Phone:</Text>{' '}
                  {order.contactPerson.phone}
               </Text>
               <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Tips Earned:</Text> $
                  {order.tip?.amount.toFixed(2)}
               </Text>
               <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Delivered At:</Text>{' '}
                  {format(order.deliveredOn!, 'pp')}
               </Text>
               <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Duration:</Text>{' '}
                  {differenceInMinutes(order.deliveredOn!, order.orderDate)} mins
               </Text>
            </View>
            <View style={styles.innerContainer}>
               <Text style={{ fontWeight: 'bold' }}>Picked Up At:</Text>
               <Text style={styles.text}>{business?.name}</Text>
               <Text style={styles.text}>{business?.address}</Text>
            </View>
            {order.deliveryInstructions && (
               <View style={styles.innerContainer}>
                  <Text style={{ fontWeight: 'bold' }}>Delivery Instruction:</Text>
                  <Text style={styles.text}>{order.deliveryInstructions}</Text>
               </View>
            )}
         </ScrollView>
      </Container>
   )
}

export default DeliveryDetails

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 24,
      backgroundColor: Colors.primary
   },
   title: {
      fontSize: 24,
      fontWeight: '600',
      marginBottom: SIZES.sm,
      textAlign: 'center'
   },
   text: {
      fontSize: 16,
      marginBottom: 8
   },
   innerContainer: {
      flex: 1,
      backgroundColor: Colors.primary,
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: 10,
      padding: SIZES.sm,
      marginTop: SIZES.md
   }
})
