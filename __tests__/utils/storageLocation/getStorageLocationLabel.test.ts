/**
 * getStorageLocationLabel Tests
 */

import { getStorageLocationLabel } from '@/utils/storageLocation/getStorageLocationLabel';
import { StorageLocation } from '@/data/enums/storage_location';

describe('getStorageLocationLabel', () => {
  describe('한국어 (기본)', () => {
    it('REFRIGERATOR는 "냉장실"을 반환한다', () => {
      expect(getStorageLocationLabel({ storageLocation: StorageLocation.REFRIGERATOR })).toBe('냉장실');
    });

    it('FREEZER는 "냉동실"을 반환한다', () => {
      expect(getStorageLocationLabel({ storageLocation: StorageLocation.FREEZER })).toBe('냉동실');
    });

    it('ROOM_TEMPERATURE는 "실온"을 반환한다', () => {
      expect(getStorageLocationLabel({ storageLocation: StorageLocation.ROOM_TEMPERATURE })).toBe('실온');
    });
  });

  describe('영어', () => {
    it('REFRIGERATOR는 "refrigerator"를 반환한다', () => {
      expect(getStorageLocationLabel({ storageLocation: StorageLocation.REFRIGERATOR, lang: 'en' })).toBe(
        'refrigerator',
      );
    });

    it('FREEZER는 "freezer"를 반환한다', () => {
      expect(getStorageLocationLabel({ storageLocation: StorageLocation.FREEZER, lang: 'en' })).toBe('freezer');
    });

    it('ROOM_TEMPERATURE는 "room temperature"를 반환한다', () => {
      expect(getStorageLocationLabel({ storageLocation: StorageLocation.ROOM_TEMPERATURE, lang: 'en' })).toBe(
        'room temperature',
      );
    });
  });
});
