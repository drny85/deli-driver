import { Colors } from '@/constants/Colors'
import { useFont } from '@shopify/react-native-skia'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SharedValue, useSharedValue } from 'react-native-reanimated'
import { Container } from './Container'
import CircularProgressBar from './ScoreCircle'

const radius = 100 // Example radius

const diameter = radius * 2
const width = diameter
const height = diameter

type Props = {
   onPress: () => void
   end: SharedValue<number>
}

const GoOnline = ({ onPress, end }: Props) => {
   const progress = useSharedValue(1)
   const font = useFont(require('@/assets/fonts/Genos-SemiBold.ttf'), 40)

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
               onPress={onPress}
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
               <Text style={{ fontFamily: 'Genos-Bold', fontSize: 36 }}>Go Online</Text>
            </TouchableOpacity>
         </View>
      </Container>
   )
}

export default GoOnline
