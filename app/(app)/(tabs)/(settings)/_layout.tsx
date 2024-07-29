import React from 'react'
import { Stack } from 'expo-router'
import { Alert, Text, TouchableOpacity } from 'react-native'
import { Colors } from '@/constants/Colors'
import { useAuth } from '@/providers/authProvider'

const SettingsLayout = () => {
   const { logOut } = useAuth()

   return (
      <Stack>
         <Stack.Screen
            name="index"
            options={{
               title: 'Settings',
               headerShown: false
            }}
         />
      </Stack>
   )
}

export default SettingsLayout
