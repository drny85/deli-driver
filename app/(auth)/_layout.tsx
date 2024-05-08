import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/providers/authProvider';
import { Colors } from '@/constants/Colors';

const AuthLayout = () => {
  const { user } = useAuth();

  if (user && !user.emailVerified) return <Redirect href={'/(auth)/verifyEmail'} />;
  if (user && user.emailVerified) return <Redirect href={'/(tabs)/(home)'} />;
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
      }}>
      <Stack.Screen
        name="login"
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{ title: '', headerTintColor: Colors.main, headerBackTitle: 'Back' }}
      />
      <Stack.Screen name="verifyEmail" />
    </Stack>
  );
};

export default AuthLayout;
