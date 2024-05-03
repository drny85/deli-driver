import { Text } from 'react-native';
import NeoView from '../NeoView';

const ETA = ({ title, subtitle, size }: { title: string; subtitle: string; size?: number }) => {
  return (
    <NeoView rounded size={size || 60}>
      <Text style={{ fontSize: 18, fontFamily: 'Genos-Bold' }}>{title}</Text>
      <Text style={{ fontSize: 14, fontFamily: 'Genos-Bold' }}>{subtitle}</Text>
    </NeoView>
  );
};

export default ETA;
