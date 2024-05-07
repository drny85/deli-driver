import { View } from 'react-native';

import { Colors } from '@/constants/Colors';

const Divider = ({ small }: { small?: boolean }) => {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: Colors.main,
        width: small ? '80%' : '100%',
        marginVertical: 4,
        alignSelf: small ? 'center' : undefined,
      }}
    />
  );
};

export default Divider;
