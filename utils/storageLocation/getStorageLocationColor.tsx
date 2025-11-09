import { StorageLocation } from '@/data/enums/storage_location';
import { Colors } from '@/lib/theme';

export function getStorageLocationColor(location?: StorageLocation | null): string {
  const colors = Colors.light;

  switch (location) {
    case StorageLocation.REFRIGERATOR:
      return colors.blue800; // 냉장
    case StorageLocation.FREEZER:
      return colors.blue800; // 냉동
    case StorageLocation.ROOM_TEMPERATURE:
      return colors.yellow800; // 실온
    default:
      return colors.grey800; // null, undefined 등 기본
  }
}
