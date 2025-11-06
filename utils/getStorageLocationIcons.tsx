import { Refrigerator, Snowflake, Home } from 'lucide-react-native';
import { StorageLocationType } from '@/constants/storageLocations';

export function getStorageLocationIcon(location: StorageLocationType, size: number = 20) {
  let iconColor: string;

  switch (location) {
    case 'fridge':
      iconColor = '#3B82F6'; // Blue - 냉장
      break;
    case 'freezer':
      iconColor = '#38BDF8'; // Sky Blue - 냉동
      break;
    case 'room_temp':
      iconColor = '#F59E0B'; // Amber - 실온
      break;
    default:
      iconColor = '#9CA3AF'; // Gray - 기타
      break;
  }

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
