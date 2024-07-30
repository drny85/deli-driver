import { Container } from '@/components/Container'
import EarningsScreen from '@/components/EarningByDays'
import NeoView from '@/components/NeoView'
import Row from '@/components/Row'
import { Colors, SIZES } from '@/constants/Colors'
import { useUser } from '@/hooks/useUser'
import { useOrdersStore } from '@/providers/ordersStore'
import { ORDER_STATUS } from '@/typing'

import dayjs from 'dayjs'
import { router } from 'expo-router'
import * as Animatable from 'react-native-animatable'

import { useMemo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Home = () => {
   const { user } = useUser()
   const orders = useOrdersStore((state) =>
      state.orders.filter(
         (o) =>
            o.status !== ORDER_STATUS.cancelled &&
            dayjs(o.orderDate).startOf('day').isSame(dayjs().startOf('day'))
      )
   )

   const deliveredOrders = useMemo(
      () => orders.filter((o) => o.status === ORDER_STATUS.delivered),
      [orders]
   )

   const todayOrders = orders.filter((o) => o.status === ORDER_STATUS.marked_ready_for_delivery)
   const inQueue = orders.filter((o) => o.status === ORDER_STATUS.accepted_by_driver)
   const completed = orders.filter((o) => o.status === ORDER_STATUS.delivered)

   const currentOrder = useMemo(
      () => orders.filter((o) => o.status === ORDER_STATUS.picked_up_by_driver),
      [orders]
   )[0]
   return (
      <Container>
         <View style={styles.container}>
            {!user?.isOnline && <Text style={styles.offlineTitle}>You are Off-line</Text>}
            {currentOrder && (
               <View>
                  <Animatable.Text
                     onPress={() =>
                        router.push({
                           pathname: '/(maps)/maps',
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
            <TouchableOpacity onPress={() => router.push('/(delivery)/delivery')}>
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

            {deliveredOrders.length > 0 && <EarningsScreen orders={deliveredOrders} />}
         </View>
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
