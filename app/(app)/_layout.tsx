import { Stack } from 'expo-router'

import { Fonts } from '@/constants/fonts'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useCourierNotification } from '@/hooks/useCourrierNotification'
import { useUserListener } from '@/hooks/useUserListener'
import { use } from 'i18next'
SplashScreen.preventAutoHideAsync()

export const unstable_settings = {
   // Ensure that reloading on `/modal` keeps a back button present.
   initialRouteName: '(tabs)'
}
export default function App() {
   const [fontsLoaded, error] = useFonts(Fonts)

   const onLayout = useCallback(async () => {
      if (fontsLoaded && !error) {
         SplashScreen.hideAsync()
      }
   }, [fontsLoaded, error])

   if (!fontsLoaded) {
      return null
   }

   return (
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayout}>
         <BottomSheetModalProvider>
            <RootLayout />
         </BottomSheetModalProvider>
      </GestureHandlerRootView>
   )
}

// You can explore the built-in icon families and icons on the web at XXXXXXXXXXXXXXXXXXXXXXX

function RootLayout() {
   useCourierNotification()
   useUserListener()
   return (
      <Stack screenOptions={{ animation: 'slide_from_bottom' }} initialRouteName="(tabs)">
         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
         <Stack.Screen name="(maps)" options={{ headerShown: false }} />
         <Stack.Screen name="(auth)" options={{ headerShown: false }} />
         <Stack.Screen name="(modals)" options={{ headerShown: false }} />
         {/* <Stack.Screen name="notlocation" options={{ headerShown: false }} /> */}
         {/* <Stack.Screen
        name="quiz"
        options={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },

          title: 'Quiz',
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom',
          animationDuration: 500,
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.primary,
          },

          title: 'Results',
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom',
          animationDuration: 500,
        }}
      /> */}
      </Stack>
   )
}
