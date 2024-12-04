import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import LottieView from 'lottie-react-native'
import { Container } from '../Container'
import { SIZES } from '@/constants/Colors'

const Searching = () => {
   const [dots, setDots] = useState('')

   useEffect(() => {
      const interval = setInterval(() => {
         setDots((prev) => (prev.length < 3 ? prev + '.' : ''))
      }, 500)

      return () => clearInterval(interval) // Cleanup on unmount
   }, [])
   return (
      <Container>
         <LottieView
            style={{ flex: 1 }}
            autoPlay
            loop
            source={require('@/assets/animations/searching_light.json')}
         />
         <View
            style={{
               position: 'absolute',
               top: SIZES.statusBarHeight + 80,
               left: 0,
               right: 0,
               bottom: 0
            }}>
            <Text
               style={{
                  fontSize: 30,
                  fontFamily: 'Genos-Bold',
                  textAlign: 'center',
                  color: 'black'
               }}>
               Searching for the next closest delivery {dots}
            </Text>
         </View>
      </Container>
   )
}

export default Searching
