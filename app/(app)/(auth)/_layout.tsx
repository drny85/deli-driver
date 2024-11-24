import Loading from '@/components/Loading'
import { Colors } from '@/constants/Colors'
import { useUser } from '@/hooks/useUser'
import { Redirect, Stack } from 'expo-router'
import React from 'react'

const AuthLayout = () => {
   const { loading, user } = useUser()

   if (loading) {
      return <Loading />
   }

   if (user && user.emailVerified && user.type === 'courier' && user.isActive) {
      console.log('ONBOARDING COMPLETED')
      return <Redirect href={'/(app)/(tabs)/(home)'} />
   }

   return (
      <Stack
         screenOptions={{
            headerShadowVisible: false,
            headerStyle: {
               backgroundColor: Colors.primary
            }
         }}>
         <Stack.Screen
            name="login"
            options={{
               title: ''
            }}
         />
         <Stack.Screen
            name="signup"
            options={{ title: '', headerTintColor: Colors.main, headerBackTitle: 'Back' }}
         />
         <Stack.Screen name="verifyEmail" options={{ headerShown: false }} />
         <Stack.Screen name="onboarding" options={{ title: 'Required Info' }} />
         <Stack.Screen name="stripe-onboarding" options={{ title: 'Payment Info' }} />
         <Stack.Screen name="welcome" options={{ headerShown: false }} />
      </Stack>
   )
}

export default AuthLayout
