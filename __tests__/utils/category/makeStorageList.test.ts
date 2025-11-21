/**
 * makeStorageList Tests
 */

import { makeStorageList } from '@/utils/category/makeStorageList';
import { StorageLocation } from '@/data/enums/storage_location';

describe('makeStorageList', () => {
  describe('lang 옵션', () => {
    it('lang이 kr이면 한국어 라벨을 반환한다', () => {
      const result = makeStorageList({ lang: 'kr' });

      const refrigerator = result.find((item) => item.id === StorageLocation.REFRIGERATOR);
      expect(refrigerator?.label).toBe('냉장실');
    });

    it('lang이 en이면 영어 라벨을 반환한다', () => {
      const result = makeStorageList({ lang: 'en' });

      const refrigerator = result.find((item) => item.id === StorageLocation.REFRIGERATOR);
      expect(refrigerator?.label).toBe('refrigerator');
    });

    it('기본값은 lang이 kr이다', () => {
      const result = makeStorageList();

      const refrigerator = result.find((item) => item.id === StorageLocation.REFRIGERATOR);
      expect(refrigerator?.label).toBe('냉장실');
    });
  });

  describe('반환 형식', () => {
    it('모든 StorageLocation을 포함한다', () => {
      const result = makeStorageList();
      const storageValues = Object.values(StorageLocation);

      expect(result.length).toBe(storageValues.length);
      storageValues.forEach((storage) => {
        expect(result.find((item) => item.id === storage)).toBeDefined();
      });
    });

    it('각 항목은 id와 label을 가진다', () => {
      const result = makeStorageList();

      result.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('label');
      });
    });
  });
});
