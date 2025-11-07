import { StorageLocationType } from '@/constants/storageLocations';
import { Colors } from '@/lib/theme';

export function getStorageLocationColors(location: StorageLocationType): string {
  const colors = Colors.light; // 컬러 토큰은 light/dark 동일

  switch (location) {
    case 'fridge':
      return colors.blue500; // 파랑 - 냉장
    case 'freezer':
      return colors.blue300; // 하늘색 - 냉동
    case 'room_temp':
      return colors.orange500; // 주황 - 실온
    default:
      return colors.grey600;
  }
}
