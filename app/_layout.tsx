import { AuthProvider } from '@/providers/authProvider'
import { Slot } from 'expo-router'

const _layout = () => {
   return (
      <AuthProvider>
         <Slot />
      </AuthProvider>
   )
}

export default _layout
