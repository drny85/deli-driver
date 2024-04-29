import { View, Text } from 'react-native';
import React from 'react';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { router } from 'expo-router';
import { useBackgroundLocation } from '@/hooks/useLocation';

const Home = () => {
  const { locationStarted, stopLocation, startLocationTracking } = useBackgroundLocation();

  console.log(locationStarted);
  return (
    <Container>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        <View style={{ width: '60%', gap: 60 }}>
          <Button title="Maps" onPress={() => router.push('/(maps)/maps')} />

          <Button title="Start" onPress={() => startLocationTracking(20)} />

          <Button title="Stop" onPress={stopLocation} />
        </View>
      </View>
    </Container>
  );
};

export default Home;
