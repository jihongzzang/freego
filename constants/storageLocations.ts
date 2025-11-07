/**
 * 보관 장소 상수
 */

export interface StorageLocationItem {
  id: StorageLocationType; // 고유 식별자
  krLabel: string; // UI 한글명
  enLabel: string; // 영어명
  value: string;
}

export const STORAGE_LOCATIONS = [
  { id: 'fridge', value: 'fridge', krLabel: '냉장실', enLabel: 'Refrigerator' },
  { id: 'freezer', value: 'freezer', krLabel: '냉동실', enLabel: 'Freezer' },
  {
    id: 'room_temp',
    value: 'room_temp',
    krLabel: '실온',
    enLabel: 'Room Temperature',
  },
] as const;

// ✅ 타입 자동 추론 (‘any’ 방지)
export type StorageLocationType = (typeof STORAGE_LOCATIONS)[number]['id'];

// ✅ 옵셔널 처리
export const findStorageLocationById = (id?: StorageLocationType): StorageLocationItem | undefined =>
  id ? STORAGE_LOCATIONS.find((loc) => loc.id === id) : undefined;
