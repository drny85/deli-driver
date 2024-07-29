import { Alert, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth } from '@/providers/authProvider'
import { updateCourier } from '@/actions/user/createCourier'

const OnlineToggleButton = () => {
   const { user } = useAuth()

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
                  // Handle the online/offline toggle logic here
                  updateCourier({ ...user, isOnline: !user?.isOnline })
               }
            }
         ]
      )
   }
   return (
      <TouchableOpacity onPress={handleOnlineToggle}>
         <Text style={{ fontSize: 16, fontWeight: '500', color: 'grey' }}>
            {user?.isOnline ? 'Go Offline' : 'Go Online'}
         </Text>
      </TouchableOpacity>
   )
}

export default OnlineToggleButton
