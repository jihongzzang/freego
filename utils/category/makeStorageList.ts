import { StorageLocation } from '@/data/enums/storage_location';
import { getStorageLocationLabel } from '../storageLocation';

interface MakeStorageLocationListOptions {
  lang?: 'kr' | 'en'; // 언어 선택
}

export function makeStorageList({ lang = 'kr' }: MakeStorageLocationListOptions = {}) {
  const storages = Object.values(StorageLocation)
    .filter((v) => typeof v === 'number')
    .map((storage) => ({
      id: storage as StorageLocation,
      label: getStorageLocationLabel({ storageLocation: storage as StorageLocation, lang }),
    }));

  return storages;
}
