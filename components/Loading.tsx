import { View, ActivityIndicator } from 'react-native';

import { Container } from './Container';
import { Colors } from '@/constants/Colors';

const Loading = () => {
  return (
    <Container>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Colors.main} />
      </View>
    </Container>
  );
};

export default Loading;
