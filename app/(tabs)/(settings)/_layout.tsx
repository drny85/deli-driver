import React from 'react';
import { Stack } from 'expo-router';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/providers/authProvider';

const SettingsLayout = () => {
  const { logOut } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Settings',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                Alert.alert('Signing Out', 'Are you sure that you want to log out?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Yes, Log Out', onPress: logOut, style: 'destructive' },
                ]);
              }}>
              <Text style={{ fontSize: 20, fontFamily: 'Genos' }}>Log Out</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default SettingsLayout;
