import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/providers/authProvider';

const AuthLayout = () => {
  const { user } = useAuth();

  if (user) return <Redirect href={'/(tabs)/(home)'} />;
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthLayout;
