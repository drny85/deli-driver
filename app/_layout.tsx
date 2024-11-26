import { AuthProvider } from '@/providers/authProvider'
import { ModalProvider } from '@/providers/ModalProvider'
import { Slot } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const _layout = () => {
   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
         <AuthProvider>
            <ModalProvider>
               <Slot />
            </ModalProvider>
         </AuthProvider>
      </GestureHandlerRootView>
   )
}

export default _layout
