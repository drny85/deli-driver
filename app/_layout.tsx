import { Stack } from 'expo-router';

import { Fonts } from '@/constants/fonts';
import { AuthProvider } from '@/providers/authProvider';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};
export default function App() {
  const [fontsLoaded] = useFonts(Fonts);

  const onLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <BottomSheetModalProvider>
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayout}>
        <AuthProvider>
          <RootLayout />
        </AuthProvider>
      </GestureHandlerRootView>
    </BottomSheetModalProvider>
  );
}

// You can explore the built-in icon families and icons on the web at XXXXXXXXXXXXXXXXXXXXXXX

function RootLayout() {
  return (
    <Stack screenOptions={{ animation: 'slide_from_bottom' }} initialRouteName="(tabs)">
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(maps)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
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
  );
}
