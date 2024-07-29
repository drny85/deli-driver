import { Colors } from '@/constants/Colors'
import { useFont } from '@shopify/react-native-skia'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSharedValue, withTiming } from 'react-native-reanimated'
import { Container } from './Container'
import CircularProgressBar from './ScoreCircle'
import { set } from 'react-hook-form'

const radius = 100 // Example radius

const diameter = radius * 2
const width = diameter
const height = diameter

type Props = {
   onPress: () => void
}

const GoOnline = ({ onPress }: Props) => {
   const progress = useSharedValue(1)
   const end = useSharedValue(0)
   const font = useFont(require('@/assets/fonts/Genos-SemiBold.ttf'), 40)
   const [finish, setFinish] = useState(false)
   const [text, setText] = useState('Go Online')

   useEffect(() => {
      let timer: any
      if (finish) {
         end.value = withTiming(1, { duration: 1000 })
         setText('Going Online')
         timer = setTimeout(() => {
            onPress()
         }, 1000)
      }

      return () => clearTimeout(timer)
   }, [finish])

   return (
      <Container>
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgressBar
               font={font!}
               percentage={progress}
               end={end}
               strokeWidth={26}
               radius={radius + 30}
            />
            <TouchableOpacity
               onPress={() => {
                  setFinish(true)
               }}
               activeOpacity={0.6}
               style={{
                  position: 'absolute',
                  backgroundColor: Colors.primary,
                  height,
                  width,
                  borderRadius: radius,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 20
               }}>
               <Text style={{ fontFamily: 'Genos-Bold', fontSize: 32 }}>{text}</Text>
            </TouchableOpacity>
         </View>
      </Container>
   )
}

export default GoOnline
