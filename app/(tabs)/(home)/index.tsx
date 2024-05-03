import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import NotLocationGranted from '@/components/NotLocationGranted';
import OrderProgress from '@/components/OrderProgress';
import { useBackgroundLocation } from '@/hooks/useLocation';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const Home = () => {
  const {
    stopLocation,
    startLocationTracking,
    config,

    backgroundPermission,
    foregroundPermission,
  } = useBackgroundLocation();

  if (!backgroundPermission) {
    console.log('not granted', foregroundPermission?.status);
    return <NotLocationGranted onPress={config} />;
  }

  // return <OrderProgress status="Accepted By Courier" />;

  return (
    <Container>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        <View style={{ width: '60%', gap: 60 }}>
          <Button title="Maps" onPress={() => router.push('/(maps)/maps')} />

          <Button title="Start" onPress={startLocationTracking} />

          <Button title="Stop" onPress={stopLocation} />
        </View>
      </View>
    </Container>
  );
};

export default Home;
