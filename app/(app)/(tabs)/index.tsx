import { Container } from '@/components/Container'
import NeoView from '@/components/NeoView'
import Row from '@/components/Row'
import { Colors, SIZES } from '@/constants/Colors'
import { useUser } from '@/hooks/useUser'
import { useOrdersStore } from '@/providers/ordersStore'
import { ORDER_STATUS } from '@/typing'

import { router } from 'expo-router'
import * as Animatable from 'react-native-animatable'

import EarningsData from '@/components/charts/EarningsData'
import GoOnlineCircle from '@/components/GoOnlineCircle'
import { isToday } from 'date-fns'
import { useMemo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import OnlineToggleButton, { handleOnlineToggle } from '@/components/OnlineToggleButton'

const Home = () => {
   const { user } = useUser()

   // const { getForgroundLocation } = useBackgroundLocation()t
   const orders = useOrdersStore((state) =>
      state.orders.filter((o) => o.status !== ORDER_STATUS.cancelled)
   )

   const data = useOrdersStore((state) =>
      state.orders.filter((o) => o.status !== ORDER_STATUS.cancelled && isToday(o.orderDate))
   )

   const deliveredOrders = useMemo(
      () => orders.filter((o) => o.status === ORDER_STATUS.delivered),
      [orders]
   )

   const todayOrders = data.filter((o) => o.status === ORDER_STATUS.marked_ready_for_delivery)
   const inQueue = data.filter((o) => o.status === ORDER_STATUS.accepted_by_driver)
   const completed = data.filter((o) => o.status === ORDER_STATUS.delivered)

   const currentOrder = useMemo(
      () => data.filter((o) => o.status === ORDER_STATUS.picked_up_by_driver),
      [data]
   )[0]

   return (
      <Container>
         <View style={styles.container}>
            {!user?.isOnline ? (
               <Text style={styles.offlineTitle}>You are Off-line</Text>
            ) : (
               <Row containerStyle={{ justifyContent: 'space-between' }}>
                  <Text />
                  <Text style={[styles.offlineTitle, { marginLeft: 30 }]}>Online</Text>
                  <TouchableOpacity onPress={() => handleOnlineToggle(user)}>
                     <Text style={{ color: 'grey', fontWeight: '600' }}>Go Off-line</Text>
                  </TouchableOpacity>
               </Row>
            )}
            {currentOrder && (
               <View>
                  <Animatable.Text
                     onPress={() =>
                        router.push({
                           pathname: '/maps',
                           params: { orderId: currentOrder.id }
                        })
                     }
                     animation={'pulse'}
                     iterationCount="infinite"
                     iterationDelay={1500}
                     style={styles.current}>
                     Delivery In Progress: order # {currentOrder.orderNumber}
                  </Animatable.Text>
               </View>
            )}
            <TouchableOpacity onPress={() => router.push('/deliveries')}>
               <NeoView
                  outterContainerStyles={{ borderRadius: SIZES.md }}
                  containerStyle={{ borderRadius: SIZES.md, padding: SIZES.sm }}>
                  <Row align="evenly">
                     <View style={styles.rowItem}>
                        <Text style={{ fontSize: 32, fontWeight: '600' }}>
                           {todayOrders.length}
                        </Text>
                        <Text style={styles.rowItemText}>New</Text>
                     </View>
                     <View style={styles.rowItem}>
                        <Text style={{ fontSize: 32, fontWeight: '600' }}>{inQueue.length}</Text>
                        <Text style={styles.rowItemText}>In Queue</Text>
                     </View>
                     <View style={styles.rowItem}>
                        <Text style={{ fontSize: 32, fontWeight: '600' }}>{completed.length}</Text>
                        <Text style={styles.rowItemText}>Completed</Text>
                     </View>
                  </Row>
               </NeoView>
            </TouchableOpacity>

            {deliveredOrders.length > 0 && <EarningsData orders={deliveredOrders} />}
            {deliveredOrders.length === 0 && !user?.isOnline && (
               <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                  <OnlineToggleButton size={SIZES.width / 2} />
               </View>
            )}
         </View>
         <GoOnlineCircle />
      </Container>
   )
}

export default Home

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: SIZES.md,
      gap: SIZES.md
   },
   rowItem: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: SIZES.sm
   },
   rowItemText: {
      fontSize: 14,
      fontWeight: '600',
      color: 'grey'
   },
   offlineTitle: {
      fontSize: 26,
      fontWeight: '500',
      color: Colors.main,
      textAlign: 'center'
   },
   current: {
      fontSize: 18,
      fontWeight: '500',
      color: Colors.main,
      textAlign: 'center'
   }
})
