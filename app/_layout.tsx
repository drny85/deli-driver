import { AuthProvider } from '@/providers/authProvider'
import { ModalProvider } from '@/providers/ModalProvider'
import { Slot } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'

const _layout = () => {
   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
         <AuthProvider>
            <KeyboardProvider>
               <ModalProvider>
                  <Slot />
               </ModalProvider>
            </KeyboardProvider>
         </AuthProvider>
      </GestureHandlerRootView>
   )
}

export default _layout
