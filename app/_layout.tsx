import { AuthProvider } from '@/providers/authProvider'
import { Slot } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const _layout = () => {
   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
         <AuthProvider>
            <Slot />
         </AuthProvider>
      </GestureHandlerRootView>
   )
}

export default _layout
