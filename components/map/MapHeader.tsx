import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Colors, SIZES } from '@/constants/Colors';
import NeoView from '../NeoView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  onPress: () => void;
  onCenterPress: () => void;
};

const MapHeader = ({ onPress, onCenterPress }: Props) => {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { top }]}>
      <NeoView rounded size={56} containerStyle={{ opacity: 0.7 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={26} color={Colors.main} />
        </TouchableOpacity>
      </NeoView>
      <View style={{ gap: SIZES.md }}>
        <NeoView rounded size={56} containerStyle={{ opacity: 0.7 }}>
          <TouchableOpacity onPress={onPress}>
            <Ionicons name="navigate" size={24} color={Colors.main} />
          </TouchableOpacity>
        </NeoView>
        <NeoView rounded size={56}>
          <TouchableOpacity onPress={onCenterPress}>
            <MaterialIcons name="location-searching" size={24} color={Colors.main} />
          </TouchableOpacity>
        </NeoView>
      </View>
    </View>
  );
};

export default MapHeader;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 20,
    width: '100%',
    paddingHorizontal: SIZES.md,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
