import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, SIZES } from '@/constants/Colors'
import { OrderStatus, statusList } from '@/typing'

const ICON_SIZE = 48

const Subtitle: { [key: string]: string } = {
   Processing: 'Your order is being processed',
   OutForDelivery: 'Your order is out for delivery',
   Delivered: 'Your order has been delivered',
   OrderReceived: 'Your order has been received',
   AcceptedByCourier: 'Your order has been accepted by courier',
   PickedByCourier: 'Your order has been picked by courier'
}

const OrderProgress: React.FC<{ status: OrderStatus }> = ({ status }) => {
   const [currentStatus, setCurrentStatus] = useState<number>(0)

   useEffect(() => {
      if (!status) return
      const index = statusList.findIndex((s) => s === status)
      setCurrentStatus(index)
   }, [status])

   const renderStatus = () => {
      return statusList.map((orderStatus, index) => {
         return (
            <View key={orderStatus}>
               <View style={styles.statusItem}>
                  <Ionicons
                     name="checkmark-circle"
                     size={ICON_SIZE}
                     color={index <= currentStatus ? Colors.main : 'gray'}
                  />
                  <View style={{ justifyContent: 'flex-start', marginLeft: 10 }}>
                     <Text
                        style={[
                           styles.statusText,
                           {
                              color: index <= currentStatus ? Colors.main : 'gray',
                              fontWeight: index <= currentStatus ? '700' : 'normal'
                           }
                        ]}>
                        {orderStatus}
                     </Text>
                     <Text style={styles.subStatusText}>{Subtitle[removeSpaces(orderStatus)]}</Text>
                  </View>
               </View>
               {index < statusList.length - 1 && (
                  <View>
                     {index < currentStatus && (
                        <View
                           style={{
                              width: 4,
                              backgroundColor: index <= currentStatus ? Colors.main : 'gray',

                              height: 50,
                              zIndex: -1,
                              marginLeft: ICON_SIZE * 0.45
                           }}
                        />
                     )}
                     {index >= currentStatus && (
                        <View
                           style={{
                              width: 4,
                              // backgroundColor: index <= currentStatus ? Colors.main : 'gray',
                              borderWidth: 2,
                              height: 50,
                              borderStyle: 'dashed',
                              borderColor: 'gray',

                              zIndex: -1,
                              marginLeft: ICON_SIZE * 0.45
                           }}
                        />
                     )}
                  </View>
               )}
            </View>
         )
      })
   }

   return (
      <View style={[styles.container]}>
         <Text style={{ fontSize: 28, fontFamily: 'Genos-Bold', textAlign: 'center' }}>
            Order Status
         </Text>
         <View style={styles.eta}>
            <Text style={styles.etaTitle}>Estimated Delivery</Text>
            <Text style={styles.eatTime}>{new Date().toLocaleTimeString()}</Text>
         </View>
         <View style={[styles.main]}>{renderStatus()}</View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: SIZES.md
   },
   main: {
      padding: SIZES.sm,
      backgroundColor: Colors.primary,
      borderRadius: SIZES.lg,
      marginTop: SIZES.lg
   },
   statusItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: Colors.primary
   },
   statusText: {
      fontSize: 18
   },
   subStatusText: {
      fontSize: 14,
      color: 'gray'
   },
   eta: { justifyContent: 'center', alignItems: 'center', marginVertical: SIZES.lg, gap: SIZES.sm },
   etaTitle: { fontSize: 18, fontWeight: '700', color: 'gray' },
   eatTime: {
      fontSize: 20,
      fontWeight: '700',
      color: Colors.main
   }
})

export default OrderProgress

function removeSpaces(str: string): string {
   return str.replace(/\s/g, '')
}
