import { Refrigerator, Snowflake, Home, Package } from 'lucide-react-native';
import { StorageLocation } from '@/data/enums/storage_location';
import { getStorageLocationColor } from './getStorageLocationColor';

export function getStorageLocationIcon(location: StorageLocation | null, size = 20) {
  const color = getStorageLocationColor(location);

  switch (location) {
    case StorageLocation.REFRIGERATOR:
      return <Refrigerator size={size} color={color} />;
    case StorageLocation.FREEZER:
      return <Snowflake size={size} color={color} />;
    case StorageLocation.ROOM_TEMPERATURE:
      return <Home size={size} color={color} />;
    default:
      return <Package size={size} color={color} />; // null/undefined 기본
  }
}
