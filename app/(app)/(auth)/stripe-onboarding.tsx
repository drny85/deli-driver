import { updateCourier } from '@/actions/user/createCourier'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import Loading from '@/components/Loading'
import { SIZES } from '@/constants/Colors'
import { connectedStore } from '@/firebase'
import { useUser } from '@/hooks/useUser'
import { onlyNumbers } from '@/utils/onlyNumbers'
import { sendVerificationCode } from '@/utils/sendVerificationCode'
import { router } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { SlideInDown, SlideInLeft } from 'react-native-reanimated'
import WebView, { WebViewNavigation } from 'react-native-webview'
import OTP from '../(maps)/otp'

const STEPS = [
   'Your Home or Business Address',
   'Last 4 Digits of your social',
   'Payment Information (checking account)'
]

const StripeOnboarding = () => {
   const { user } = useUser()
   const [verificationCode, setVericationCode] = useState<number | null>(null)
   const [showVerification, setShowVerification] = useState(false)
   const webViewRef = useRef<WebView>(null)
   const [loading, setLoading] = useState(false)
   const [stripeLinkUrl, setStripeLinkUrl] = useState<string | null>(null)
   const getParams = (url: string) => {
      let regexp = /[?&]([^=#]+)=([^&#]*)/g
      let params: any = {}
      let check
      while ((check = regexp.exec(url))) {
         params[check[1]] = check[2]
      }
      return params
   }

   const getLink = async () => {
      try {
         setLoading(true)
         const func = connectedStore()
         const { data } = await func({
            businessName: `${user?.name} Delivery`,
            phone: onlyNumbers(user?.phone!),
            // address: business.address!,
            lastName: user?.lastName!,
            name: user?.name!,
            type: 'courier',
            mode: process.env.NODE_ENV !== 'production' ? 'test' : undefined
         })

         if (data.success) {
            setStripeLinkUrl(data.result)
         }
      } catch (error) {
      } finally {
         setLoading(false)
      }
   }

   const handleNumberValidation = async () => {
      if (!user) return
      try {
         await updateCourier({ ...user, phoneNumberVerified: true })
         setVericationCode(null)
         setShowVerification(false)
      } catch (error) {
         console.log(error)
      }
   }

   const checkForAccountSuccefull = async (
      url: string
   ): Promise<{ success: boolean; accountId: string | null }> => {
      try {
         if (url.includes('/return_url')) {
            const { accountId } = getParams(url)
            console.log(accountId)
            return { success: true, accountId: accountId }
         } else {
            return { success: false, accountId: null }
         }
      } catch (error) {
         console.log(error)
         return { success: false, accountId: null }
      }
   }

   const handleNavigationChanges = useCallback(
      async (newNavState: WebViewNavigation) => {
         const { url, loading } = newNavState

         try {
            console.log('URL =>', url, loading)
            const { success, accountId } = await checkForAccountSuccefull(url)
            if (success && accountId) {
               router.replace('/welcome')
            }
         } catch (error) {
            console.log('ERROR =>', error)
         }
      },
      [loading]
   )

   console.log(verificationCode)

   if (loading) return <Loading />

   if (!user?.phoneNumberVerified && user?.phone && !showVerification) {
      return (
         <Container>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
               <View style={{ gap: SIZES.lg * 2 }}>
                  <View style={{ gap: SIZES.md }}>
                     <Text style={styles.text}>Your phone number is essential to do business</Text>
                     <Text style={styles.text}>We need to verify your phone number</Text>
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center', gap: SIZES.md }}>
                     <Text style={styles.text}> Is this your cell phone number?</Text>
                     <Text style={{ fontSize: 20, fontWeight: '700' }}>{user.phone}</Text>
                     <Button
                        title="Verify Phone Number"
                        disabled={loading}
                        onPress={async () => {
                           try {
                              setLoading(true)
                              const validation = await sendVerificationCode(user.phone!)
                              const { message, success } = validation
                              if (success) {
                                 console.log('CODE', message)
                                 setVericationCode(+message)
                                 setShowVerification(true)
                              }
                           } catch (error) {
                              console.log('Error getting verification code')
                           } finally {
                              setLoading(false)
                           }
                        }}
                     />
                  </View>
               </View>
            </View>
         </Container>
      )
   }

   if (stripeLinkUrl) {
      return (
         <WebView
            style={{ flex: 1, paddingTop: SIZES.md }}
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ uri: stripeLinkUrl }}
            onNavigationStateChange={handleNavigationChanges}
            sharedCookiesEnabled={true}></WebView>
      )
   }

   if (showVerification && verificationCode)
      return (
         <OTP
            code={verificationCode}
            title="Verification Code"
            lenght={6}
            callBack={handleNumberValidation}
            setShow={(value) => {
               setShowVerification(value)
            }}
            show={showVerification}
         />
      )
   return (
      <Container>
         <View style={{ flex: 1, padding: SIZES.md, justifyContent: 'space-between' }}>
            <Animated.Text
               entering={SlideInDown}
               style={{ fontSize: 28, fontFamily: 'Genos', textAlign: 'center' }}>
               You will be asked for the following information, please have it ready before cliking
               continue
            </Animated.Text>
            <View style={{ padding: SIZES.sm, gap: SIZES.md }}>
               {STEPS.map((step, index) => (
                  <Animated.Text
                     style={{ fontSize: 18 }}
                     entering={SlideInLeft.duration(index * 300).delay(index * 600)}
                     key={index}>
                     {step}
                  </Animated.Text>
               ))}
            </View>
            <Button title="Continue" onPress={getLink} />
         </View>
      </Container>
   )
}

export default StripeOnboarding

const styles = StyleSheet.create({
   text: {
      fontFamily: 'Genos',
      fontSize: 24,
      textAlign: 'center'
   }
})
