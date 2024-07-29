import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { Business, Order, ORDER_STATUS } from '@/typing'

import { Colors, SIZES } from '@/constants/Colors'
import VerticalProgressBar from './VerticalProgressBar'
import { useSharedValue, withTiming } from 'react-native-reanimated'
import Row from '../Row'
import { Ionicons } from '@expo/vector-icons'
import NeoView from '../NeoView'
import { makeCall } from '@/utils/makeCall'

const ICON_SIZE = 38

type Props = {
   order: Order
   business: Business
   distance: number
}
const MapOrderDetails = ({ order, business, distance }: Props) => {
   const progress = useSharedValue(distance)
   useEffect(() => {
      progress.value = withTiming(distance, { duration: 500 })
   }, [distance])

   return (
      <View style={styles.container}>
         <Text style={styles.tip}>Tips {order.tip?.amount.toFixed(2)}</Text>
         <Row align="between">
            <View style={{ justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
               <Ionicons
                  name="checkmark-circle"
                  size={ICON_SIZE}
                  color={order.status === ORDER_STATUS.picked_up_by_driver ? Colors.main : 'gray'}
               />

               <VerticalProgressBar full={order.status === ORDER_STATUS.delivered} height={80} />
               <Ionicons
                  name="checkmark-circle"
                  size={ICON_SIZE}
                  color={order.status === ORDER_STATUS.delivered ? Colors.main : 'gray'}
               />
            </View>
            <View style={{ gap: SIZES.lg }}>
               <Row>
                  <View style={styles.item}>
                     <Text style={[styles.title, { fontSize: 24 }]}>Pick Up At</Text>
                     <Row align="between" containerStyle={{ marginBottom: SIZES.sm }}>
                        <Text style={[{ fontSize: 20, fontFamily: 'Manjari-Bold' }]}>
                           {business.name}
                        </Text>
                        <NeoView rounded size={36} outterContainerStyles={{ borderRadius: 999 }}>
                           <TouchableOpacity
                              onPress={async () => await makeCall(order.contactPerson.phone)}>
                              <Ionicons name="call" size={22} color={Colors.main} />
                           </TouchableOpacity>
                        </NeoView>
                     </Row>

                     <Text style={styles.subtitle}>{business.address?.slice(0, -5)}</Text>
                  </View>
               </Row>

               <Row>
                  <View style={styles.item}>
                     <Text style={styles.title}>Deliver To</Text>
                     <Row align="between" containerStyle={{ marginBottom: SIZES.sm }}>
                        <Text style={[{ fontSize: 20, fontFamily: 'Manjari-Bold' }]}>
                           {order.contactPerson.name} {order.contactPerson.lastName}
                        </Text>
                        <NeoView rounded size={36} outterContainerStyles={{ borderRadius: 999 }}>
                           <TouchableOpacity
                              onPress={async () => await makeCall(order.contactPerson.phone)}>
                              <Ionicons name="call" size={22} color={Colors.main} />
                           </TouchableOpacity>
                        </NeoView>
                     </Row>
                     <Text style={styles.subtitle}>{order.address?.street.slice(0, -5)}</Text>
                     {order.address?.apt && <Text>Apt / FL: {order.address.apt}</Text>}
                  </View>
               </Row>
            </View>
         </Row>
      </View>
   )
}

export default MapOrderDetails

const styles = StyleSheet.create({
   container: {
      borderRadius: SIZES.sm,
      padding: SIZES.sm,
      backgroundColor: Colors.secondary
   },
   title: {
      fontFamily: 'Genos',
      fontSize: 20
   },
   subtitle: {
      fontFamily: 'Manjari',
      fontSize: 16
   },

   item: {
      marginLeft: SIZES.sm,
      width: '90%'
   },

   tip: {
      fontFamily: 'Genos-Bold',
      fontSize: 24,
      textAlign: 'center',
      marginBottom: SIZES.sm
   }
})
