import { Colors } from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface SegmentedControlProps {
  values: string[];
  selectedIndex: number;
  onChange: (value: string, index: number) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ values, onChange, selectedIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const translateX = useSharedValue(currentIndex * (width / values.length));

  useEffect(() => {
    setCurrentIndex(selectedIndex);
    translateX.value = withTiming(selectedIndex * (width / values.length));
  }, [selectedIndex]);

  const handlePress = (index: number) => {
    setCurrentIndex(index);
    translateX.value = withTiming(index * (width / values.length));
    onChange(values[index], index);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.controlContainer, { backgroundColor: Colors.secondary }]}>
        <Animated.View
          style={[styles.slider, { backgroundColor: Colors.primary }, animatedStyle]}
        />
        {values.map((value, index) => (
          <TouchableOpacity
            key={index}
            style={styles.controlItem}
            onPress={() => handlePress(index)}>
            <Text
              style={{
                color: currentIndex === index ? 'white' : 'black',
                fontWeight: currentIndex === index ? '800' : 'normal',
              }}>
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '96%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    alignSelf: 'center',
  },
  controlContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
  },
  slider: {
    position: 'absolute',
    width: width / 3, // Adjust this based on the number of segments
    height: '100%',

    borderRadius: 10,
  },
  controlItem: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SegmentedControl;
