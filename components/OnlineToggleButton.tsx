import { Alert, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth } from '@/providers/authProvider'
import { updateCourier } from '@/actions/user/createCourier'

import { startBackgroundLocationUpdates, stopBackgroundLocationUpdates } from '@/utils/location'
import { useSettingsStore } from '@/providers/settingsStore'
import { useOrdersStore } from '@/providers/ordersStore'
import { ORDER_STATUS } from '@/typing'
import { isToday } from 'date-fns'
import { Colors } from '@/constants/Colors'

type Props = {
   size?: number
}
const OnlineToggleButton = ({ size }: Props) => {
   const { user } = useAuth()
   const { orders } = useOrdersStore()
   const todayOrders = orders.filter((o) => isToday(o.orderDate))

   const preventFromGoingOffilenWithPendingOrders = () => {
      if (user?.isOnline && todayOrders?.some((o) => o.status !== ORDER_STATUS.delivered)) {
         Alert.alert('Pending Orders', 'You have pending orders. Please deliver them first')
         return true
      }
      return false
   }

   const handleOnlineToggle = () => {
      // Implement online/offline toggle logic here
      Alert.alert(
         `${user?.isOnline ? 'Going Offline' : 'Going Online'}`,
         `${user?.isOnline ? 'Are yuo sure you want to go Offline?' : 'Are you sure you want to go Online ?'}`,
         [
            {
               text: 'Cancel',
               style: 'cancel'
            },
            {
               text: 'Yes, I am sure',
               style: 'destructive',
               onPress: () => {
                  if (!user) return
                  const canContinue = preventFromGoingOffilenWithPendingOrders()
                  if (canContinue) return
                  // Handle the online/offline toggle logic here
                  updateCourier({ ...user, isOnline: !user?.isOnline })
                  if (user.isOnline) {
                     // send notification to all drivers that user is offline
                     stopBackgroundLocationUpdates()
                  } else {
                     // send notification to all drivers that user is online
                     useSettingsStore.getState().onOpen()
                     startBackgroundLocationUpdates()
                  }
               }
            }
         ]
      )
   }
   return user?.isOnline ? (
      <TouchableOpacity
         style={{ alignSelf: 'flex-end', marginRight: 14 }}
         onPress={handleOnlineToggle}>
         <Text style={{ fontSize: 16, fontWeight: '500', color: 'grey' }}>Go Offline</Text>
      </TouchableOpacity>
   ) : (
      <TouchableOpacity
         onPress={handleOnlineToggle}
         style={{
            //position: 'absolute',

            width: size || 100,
            height: size || 100,
            borderRadius: size ? size / 2 : 100,
            justifyContent: 'center',
            alignItems: 'center',

            backgroundColor: Colors.main
         }}>
         <Text style={{ fontSize: 40, fontWeight: '600', color: 'white' }}>Go</Text>
         <Text style={{ fontSize: 20, fontWeight: '600', color: 'white' }}>Online</Text>
      </TouchableOpacity>
   )
}

export default OnlineToggleButton
