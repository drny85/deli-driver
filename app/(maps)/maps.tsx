import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MapView, { Region } from 'react-native-maps';
import { Colors, SIZES } from '@/constants/Colors';
import { useBackgroundLocation } from '@/hooks/useLocation';
import NeoView from '@/components/NeoView';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import BottomSheet, {
  BottomSheetScrollView,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedMap = Animated.createAnimatedComponent(MapView);

const Maps = () => {
  const mapViewRef = useRef<MapView>(null);
  const height = useSharedValue(0.2);
  const { top } = useSafeAreaInsets();
  const { getForgroundLocation } = useBackgroundLocation();
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);

  const snapshots = useMemo(() => ['20%', '50%', '90%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const getRegion = () => {
    getForgroundLocation().then((location) => {
      if (!location) return;
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.07,
      });
    });
  };

  const animatedHeight = useAnimatedStyle(() => ({
    bottom: withTiming(SIZES.height * height.value),
  }));

  useEffect(() => {
    getRegion();
    if (!initialRegion) return;
    mapViewRef.current?.animateToRegion(
      {
        ...initialRegion,
        latitudeDelta: 0.04,
        longitudeDelta: 0.05,
      },
      1000
    );
  }, [initialRegion]);
  return (
    <View style={styles.container}>
      {initialRegion && (
        <AnimatedMap
          style={[styles.map, animatedHeight]}
          mapPadding={{
            left: 20,
            top: 50,
            right: 20,
            bottom: 10,
          }}
          ref={mapViewRef}
          zoomEnabled
          zoomControlEnabled
          initialRegion={initialRegion}
          region={initialRegion}
          showsUserLocation
          followsUserLocation
          zoomTapEnabled
          showsPointsOfInterest={false}
          showsBuildings={false}></AnimatedMap>
      )}
      <NeoView
        rounded
        size={56}
        containerStyle={{ position: 'absolute', left: 20, top, opacity: 0.7 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={26} color={Colors.main} />
        </TouchableOpacity>
      </NeoView>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapshots}
        onChange={(change) => {
          if (change === 1) {
            height.value = withTiming(0.5);
          } else if (change === 2) {
            height.value = withTiming(0.5);
          } else if (change === 0) {
            height.value = withTiming(0.2, { duration: 500 });
          }
        }}
        index={0}
        handleIndicatorStyle={{ backgroundColor: Colors.main }}>
        <BottomSheetScrollView
          contentContainerStyle={{ backgroundColor: Colors.primary, padding: SIZES.lg }}>
          <Text>Hello</Text>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default Maps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
});
