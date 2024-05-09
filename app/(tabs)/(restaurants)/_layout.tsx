import React from 'react';
import { Stack } from 'expo-router';
import { StackScreenWithSearchBar } from '@/constants/layout';
import { Colors } from '@/constants/Colors';

const HomeLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Businesses',
          ...StackScreenWithSearchBar,
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
