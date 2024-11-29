import { SIZES } from '@/constants/Colors'
import { useAuth } from '@/providers/authProvider'
import { useSettingsStore } from '@/providers/settingsStore'
import { Modal, Text, View } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

const W = SIZES.width / 2

const GoOnlineCircle = () => {
   const { user } = useAuth()
   const { isOpen, onClose } = useSettingsStore()
   const onComplete = () => {
      if (!user) return

      onClose()
   }
   return (
      <Modal visible={isOpen} animationType="slide">
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CountdownCircleTimer
               isPlaying
               duration={3}
               size={W}
               strokeWidth={W / 5}
               colors={['#004777', '#F7B801', '#A30000', '#A30000']}
               onComplete={onComplete}
               colorsTime={[3, 2, 1, 0]}>
               {({ remainingTime }) => (
                  <Text
                     accessibilityRole="timer"
                     accessibilityLiveRegion="assertive"
                     importantForAccessibility="yes"
                     style={{ fontSize: 28, fontWeight: '700' }}>
                     {remainingTime}
                  </Text>
               )}
            </CountdownCircleTimer>
         </View>
      </Modal>
   )
}

export default GoOnlineCircle
