import { Refrigerator, Snowflake, Home, Package } from 'lucide-react-native';
import { StorageLocationType } from '@/constants/storageLocations';
import { getStorageLocationColors } from './getStorageLocationColors';

export function getStorageLocationIcon(location?: StorageLocationType, size: number = 20) {
  const iconColor = getStorageLocationColors(location);

  switch (location) {
    case 'fridge':
      return <Refrigerator size={size} color={iconColor} />;
    case 'freezer':
      return <Snowflake size={size} color={iconColor} />;
    case 'room_temp':
      return <Home size={size} color={iconColor} />;
    default:
      return <Package size={size} color={iconColor} />;
  }
}
