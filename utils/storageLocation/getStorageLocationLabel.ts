import { StorageLocation } from '@/data/enums/storage_location';

export function getStorageLocationLabel({
  storageLocation,
  lang = 'kr',
}: {
  storageLocation: StorageLocation;
  lang?: 'kr' | 'en';
}): string {
  const map: Record<StorageLocation, { kr: string; en: string }> = {
    [StorageLocation.ROOM_TEMPERATURE]: { kr: '실온', en: 'room temperature' },
    [StorageLocation.REFRIGERATOR]: { kr: '냉장실', en: 'refrigerator' },
    [StorageLocation.FREEZER]: { kr: '냉동실', en: 'freezer' },
  };

  return map[storageLocation][lang];
}
