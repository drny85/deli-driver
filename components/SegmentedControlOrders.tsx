import { NativeSyntheticEvent } from 'react-native';
import SegmentedControl, {
  NativeSegmentedControlIOSChangeEvent,
} from '@react-native-segmented-control/segmented-control';

type Props = {
  values: string[];
  selectedIndex: number;
  onChange: (event: NativeSyntheticEvent<NativeSegmentedControlIOSChangeEvent>) => void;
};
const SegmentedControlOrders = ({ values, selectedIndex, onChange }: Props) => {
  return <SegmentedControl values={values} selectedIndex={selectedIndex} onChange={onChange} />;
};

export default SegmentedControlOrders;
