import Loading from '@/components/Loading';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/providers/authProvider';
import { Redirect, router, Stack } from 'expo-router';
import React, { useEffect } from 'react';

const AuthLayout = () => {
  const { loading, user } = useUser();

  if (user && user.emailVerified && user.type === 'courier' && user.isActive) {
    console.log('ONBOARDING COMPLETED');
    return <Redirect href={'/(tabs)/(home)'} />;
  }

  if (loading) {
    return <Loading />;
  }

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
      <Stack.Screen name="onboarding" />
    </Stack>
  );
};

export default AuthLayout;
