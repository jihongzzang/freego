import { StorageLocationType } from '@/constants/storageLocations';

export function getStorageColor(location: StorageLocationType): string {
  switch (location) {
    case 'fridge':
      return '#3B82F6';
    case 'freezer':
      return '#8B5CF6';
    case 'room_temp':
      return '#10B981';
    default:
      return '#6B7280';
  }
}
