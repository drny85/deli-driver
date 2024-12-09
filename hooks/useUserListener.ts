import { useAuth } from '@/providers/authProvider'
import { useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'

export const useUserListener = () => {
   const segments = useSegments()
   const { user } = useAuth()
   const router = useRouter()
   const inAuthGroup = segments[1] === '(auth)'

   useEffect(() => {
      if (!user) {
         router.replace('/(app)/(auth)/login')
         return
      }

      if (user.type !== 'courier') {
         router.replace('/(app)/(auth)/login')
         return
      }

      if (!user.emailVerified) {
         router.replace('/verifyEmail')
         return
      }

      if (!user.charges_enabled) {
         router.replace('/stripe-onboarding')
         return
      }

      if (inAuthGroup) {
         router.replace('/(app)/(tabs)')
      }
   }, [user, inAuthGroup, segments, router])
}
