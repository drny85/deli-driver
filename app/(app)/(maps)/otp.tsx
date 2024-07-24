import { Feather } from '@expo/vector-icons'
import AnimatedLottieView from 'lottie-react-native'
import { MotiView } from 'moti'
import React, { useEffect } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Animatble from 'react-native-animatable'

import { Container } from '@/components/Container'
import NeoView from '@/components/NeoView'
import { Colors, SIZES } from '@/constants/Colors'

let TIME_OUT: NodeJS.Timeout | null = null

type Props = {
   code: number
   title: string
   callBack: () => void
   lenght: number
   show?: boolean
   override?: number
   extraInfo?: string
   setShow?: (show: boolean) => void
}

const OTP = ({ code, lenght, title, callBack, extraInfo, override, show, setShow }: Props) => {
   //const otpRequired = useAppSelector((state) => state.courier.otpRequired);
   const [otp, setOpt] = React.useState<number[]>([])
   const codigo = +otp.slice(0, lenght).join('')
   const [loading, setLoading] = React.useState(false)
   const [invalid, setInvalid] = React.useState(false)
   const [showNumber, setShowNumber] = React.useState(true)

   useEffect(() => {
      if ((otp.length === lenght && code === codigo) || (override && override === codigo)) {
         setLoading(true)
      }

      if (otp.length === lenght && code !== codigo) {
         setInvalid(true)
         TIME_OUT = setTimeout(() => {
            setInvalid(false)

            //setOpt([]);
         }, 800)
      }

      return () => {
         if (TIME_OUT) {
            clearTimeout(TIME_OUT)
         }
      }
   }, [otp.length, code])

   return (
      <Modal visible={show} presentationStyle="fullScreen" animationType="slide">
         <Container>
            {extraInfo && (
               <Text
                  style={{
                     textAlign: 'center',
                     fontWeight: '500',
                     fontFamily: 'Genos-Bold',
                     fontSize: 22,
                     marginTop: SIZES.md
                  }}>
                  {extraInfo}
               </Text>
            )}
            {otp.length === lenght && loading ? (
               <AnimatedLottieView
                  source={require('@/assets/animations/lock_light.json')}
                  autoPlay
                  style={{ flex: 1 }}
                  loop={false}
                  onAnimationFinish={() => {
                     callBack()
                     setLoading(false)
                  }}
               />
            ) : (
               <Animatble.View
                  animation={invalid ? 'shake' : undefined}
                  style={{
                     backgroundColor: Colors.primary,
                     flex: 1,
                     justifyContent: 'center',
                     alignItems: 'center'
                  }}>
                  <Text style={{ fontFamily: 'Genos-Bold', fontSize: 26, marginBottom: SIZES.md }}>
                     {title}
                  </Text>
                  <View style={styles.digitsRow}>
                     {otp.map((digit, index) =>
                        showNumber ? (
                           <MotiView
                              key={index}
                              from={{ opacity: 0, translateY: 10 }}
                              animate={{ opacity: 1, translateY: 0 }}
                              exit={{ opacity: 0, translateY: 10 }}>
                              <Text
                                 style={{
                                    fontFamily: 'Genos-Bold',
                                    fontSize: 26,
                                    color: Colors.main
                                 }}
                                 key={index}>
                                 {digit}
                              </Text>
                           </MotiView>
                        ) : (
                           <MotiView
                              key={index}
                              animate={{
                                 opacity: 1,
                                 height: 24,
                                 width: 24,
                                 borderRadius: 12,
                                 backgroundColor: Colors.main,
                                 translateY: 0,
                                 marginBottom: 10
                              }}
                              from={{
                                 opacity: 0,
                                 translateY: 10,
                                 height: 0,
                                 width: 0
                              }}
                              exit={{ opacity: 0, translateY: 10 }}
                           />
                        )
                     )}
                  </View>
                  <View style={styles.digitsRow}>
                     <DIGIT
                        value={1}
                        otp={otp}
                        lenght={lenght}
                        onPress={() => setOpt((prev) => [...prev, 1])}
                     />
                     <DIGIT
                        lenght={lenght}
                        value={2}
                        otp={otp}
                        onPress={() => setOpt((prev) => [...prev, 2])}
                     />
                     <DIGIT
                        lenght={lenght}
                        value={3}
                        otp={otp}
                        onPress={() => setOpt((prev) => [...prev, 3])}
                     />
                  </View>
                  <View style={styles.digitsRow}>
                     <DIGIT
                        lenght={lenght}
                        value={4}
                        otp={otp}
                        onPress={() => setOpt((prev) => [...prev, 4])}
                     />
                     <DIGIT
                        lenght={lenght}
                        value={5}
                        otp={otp}
                        onPress={() => setOpt((prev) => [...prev, 5])}
                     />
                     <DIGIT
                        lenght={lenght}
                        value={6}
                        otp={otp}
                        onPress={() => setOpt((prev) => [...prev, 6])}
                     />
                  </View>
                  <View style={styles.digitsRow}>
                     <DIGIT
                        lenght={lenght}
                        value={7}
                        otp={otp}
                        onPress={() => setOpt((prev) => [...prev, 7])}
                     />
                     <DIGIT
                        lenght={lenght}
                        value={8}
                        otp={otp}
                        onPress={() => setOpt((prev) => [...prev, 8])}
                     />
                     <DIGIT
                        lenght={lenght}
                        value={9}
                        otp={otp}
                        onPress={() => setOpt((prev) => [...prev, 9])}
                     />
                  </View>
                  <View style={styles.digitsRow}>
                     <DIGIT
                        lenght={lenght}
                        value={
                           <Feather
                              name={showNumber ? 'eye' : 'eye-off'}
                              size={24}
                              color={Colors.main}
                           />
                        }
                        onPress={() => setShowNumber(!showNumber)}
                     />
                     <DIGIT
                        value={0}
                        otp={otp}
                        lenght={lenght}
                        onPress={() => setOpt((prev) => [...prev, 0])}
                     />

                     <DIGIT
                        lenght={lenght}
                        onPress={() => setOpt([...otp.slice(0, -1)])}
                        value={<Feather name="delete" size={26} color={Colors.main} />}
                     />
                  </View>
                  <View style={{ marginTop: SIZES.sm * 3 }}>
                     <TouchableOpacity
                        onPress={() => {
                           setOpt([])

                           if (setShow) {
                              setShow(false)
                           }
                        }}>
                        <Text>Exit</Text>
                     </TouchableOpacity>
                  </View>
               </Animatble.View>
            )}
         </Container>
      </Modal>
   )
}

export default OTP

const DIGIT = ({
   value,
   otp,
   onPress,
   lenght
}: {
   value: number | React.ReactNode
   onPress: () => void
   otp?: number[]
   lenght: number
}) => {
   return (
      <TouchableOpacity disabled={otp?.length === lenght} onPress={onPress} activeOpacity={0.7}>
         <NeoView rounded size={80}>
            <Text style={{ fontFamily: 'Genos-Bold', fontSize: 26, color: Colors.main }}>
               {value}
            </Text>
         </NeoView>
      </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
   digitsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: SIZES.md,
      marginVertical: SIZES.md * 0.5
   }
})

// const Digit = ({
//   value,
//   otp,
//   onPress,
//   lenght,
// }: {
//   value: number | React.ReactNode;
//   onPress: () => void;
//   otp?: number[];
//   lenght: number;
// }) => {
//   return (
//     <TouchableOpacity disabled={otp?.length === lenght} onPress={onPress} activeOpacity={0.7}>
//       <NeoView rounded size={80}>
//         <Text>{value}</Text>
//       </NeoView>
//     </TouchableOpacity>
//   );
// };
