import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

const MapsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="maps" />
    </Stack>
  );
};

export default MapsLayout;
