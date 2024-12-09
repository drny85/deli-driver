import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Container } from '@/components/Container'
import { useAuth } from '@/providers/authProvider'
import Animated, { SlideInDown, SlideInUp } from 'react-native-reanimated'
import { SIZES } from '@/constants/Colors'
import LottieView from 'lottie-react-native'
import { router } from 'expo-router'
import { Button } from '@/components/Button'
import { auth } from '@/firebase'

const VerifyEmail = () => {
   const { user, setUser } = useAuth()

   useEffect(() => {
      if (user && user.emailVerified && !user.isActive) {
         router.replace('/onboarding')
      }
   }, [user, auth.currentUser])
   return (
      <Container>
         <View style={{ flex: 0.5 }}>
            <LottieView
               source={require('@/assets/animations/email.json')}
               autoPlay
               loop
               resizeMode="cover"
               style={{ width: 'auto', flex: 1 }}
            />
         </View>
         <View
            style={{
               flex: 0.5,

               alignItems: 'center',
               gap: SIZES.lg,
               padding: SIZES.md
            }}>
            <Animated.View
               entering={SlideInDown}
               style={{ justifyContent: 'center', alignItems: 'center', gap: SIZES.md }}>
               <Text style={{ fontFamily: 'Genos-Bold', fontSize: 30 }}>Welcome</Text>
               <Text style={{ fontFamily: 'Genos', fontSize: 20 }}>
                  We need to verify your email in order to finish your account
               </Text>
            </Animated.View>
            <Animated.View
               exiting={SlideInUp}
               style={{ gap: SIZES.sm, justifyContent: 'center', alignItems: 'center' }}>
               <Text style={{ fontFamily: 'Genos', fontSize: 20 }}>An email was sent to </Text>
               <Text style={{ fontSize: 22, fontFamily: 'Genos-Bold' }}>{user?.email}</Text>
               <Text style={{ fontFamily: 'Genos', fontSize: 20 }}>
                  Please check your junk / spam folder
               </Text>
            </Animated.View>
            <Button
               title="Refresh"
               contentTextStyle={{ paddingHorizontal: SIZES.lg * 2, fontWeight: '700' }}
               contentContainerStyle={{ borderRadius: SIZES.lg * 2 }}
               onPress={() => {
                  auth.currentUser?.reload().then(() => {
                     if (user)
                        setUser({
                           ...user,
                           emailVerified: auth.currentUser?.emailVerified || false
                        })
                  })
               }}
            />
         </View>
      </Container>
   )
}

export default VerifyEmail
