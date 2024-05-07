import { Colors, SIZES } from '@/constants/Colors';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

type Props = {
  full: boolean;
  width?: number;
  height?: number;
};
const VerticalProgressBar = ({ full, width = 4, height = 60 }: Props) => {
  return (
    <View
      style={{
        height,
        backgroundColor: Colors.primary,
        zIndex: -1,
        borderRadius: SIZES.md,
        width,
      }}>
      <Animated.View
        style={[{ width, backgroundColor: full ? Colors.main : Colors.secondary, borderRadius: 6 }]}
      />
    </View>
  );
};

export default VerticalProgressBar;
