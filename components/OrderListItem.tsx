import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Order } from '@/typing'
import { Colors, SIZES } from '@/constants/Colors'
import NeoView from './NeoView'
import Row from './Row'
import { dayjsFormat } from '@/utils/dayjs'
import { FontAwesome } from '@expo/vector-icons'

type Props = {
   item: Order
   onPress?: () => void
}
const OrderListItem = ({ item, onPress }: Props) => {
   return (
      <TouchableOpacity
         style={{ borderRadius: SIZES.sm, backgroundColor: Colors.accent }}
         onPress={onPress}>
         <NeoView
            outterContainerStyles={{ borderRadius: SIZES.sm }}
            containerStyle={{
               padding: SIZES.sm,
               borderRadius: SIZES.sm,
               backgroundColor: Colors.white
            }}>
            <Row align="between">
               <View style={{ gap: SIZES.sm }}>
                  <Row align="between" containerStyle={{ width: '90%' }}>
                     <Text style={{ fontSize: 24, fontFamily: 'Genos-Bold' }}>
                        Order # {item.orderNumber}
                     </Text>
                     <Text>{dayjsFormat(item.orderDate).format('lll')}</Text>
                  </Row>
                  <Text>{item.address?.street.slice(0, -7)}</Text>
               </View>
               <FontAwesome name="chevron-right" size={22} color={Colors.main} />
            </Row>
         </NeoView>
      </TouchableOpacity>
   )
}

export default OrderListItem
