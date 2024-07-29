import { Container } from '@/components/Container'
import EarningsScreen from '@/components/EarningByDays'
import NeoView from '@/components/NeoView'
import OrderListItem from '@/components/OrderListItem'
import { Colors, SIZES } from '@/constants/Colors'
import { useUser } from '@/hooks/useUser'
import { useOrdersStore } from '@/providers/ordersStore'
import { ORDER_STATUS } from '@/typing'
import { router } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Home = () => {
   const { user } = useUser()
   const orders = useOrdersStore((state) => state.orders)

   const deliveredOrders = useMemo(
      () => orders.filter((o) => o.status === ORDER_STATUS.delivered),
      [orders]
   )

   const currentOrder = useMemo(
      () => orders.filter((o) => o.status === ORDER_STATUS.picked_up_by_driver),
      [orders]
   )[0]
   return (
      <Container>
         <View style={styles.container}>
            {!user?.isOnline && <Text style={styles.offlineTitle}>You are Off-line</Text>}
            <NeoView
               containerStyle={{ borderRadius: SIZES.md, padding: SIZES.md }}
               outterContainerStyles={{ borderRadius: SIZES.md }}>
               <Text style={styles.current}>Current Delivery</Text>
               {currentOrder ? (
                  <OrderListItem
                     item={currentOrder}
                     onPress={() =>
                        router.push({
                           pathname: '/(maps)/maps',
                           params: { orderId: currentOrder.id! }
                        })
                     }
                  />
               ) : (
                  <Text>No Current Order</Text>
               )}
            </NeoView>

            <EarningsScreen orders={deliveredOrders} />
         </View>
      </Container>
   )
}

export default Home

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: SIZES.md
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
      textAlign: 'center',
      marginBottom: SIZES.md
   }
})
