import { Refrigerator, Snowflake, Home } from 'lucide-react-native';
import { StorageLocationType } from '@/constants/storageLocations';

export function getStorageLocationIcon(location: StorageLocationType, size: number = 20, color?: string) {
  const iconColor = color || '#6b7280';

  switch (location) {
    case 'fridge':
      return <Refrigerator size={size} color={iconColor} />;
    case 'freezer':
      return <Snowflake size={size} color={iconColor} />;
    case 'room_temp':
      return <Home size={size} color={iconColor} />;
    default:
      return <Refrigerator size={size} color={iconColor} />;
  }
}
