/**
 * makeCategoryList Tests
 */

import { makeCategoryList } from '@/utils/category/makeCategoryList';
import { Category } from '@/data/enums/category';

describe('makeCategoryList', () => {
  describe('includeAllCategory 옵션', () => {
    it('includeAllCategory가 false면 ALL 카테고리를 제외한다', () => {
      const result = makeCategoryList({ includeAllCategory: false });

      expect(result.find((item) => item.id === Category.ALL)).toBeUndefined();
      expect(result.length).toBe(Object.values(Category).length - 1);
    });

    it('includeAllCategory가 true면 ALL 카테고리를 포함한다', () => {
      const result = makeCategoryList({ includeAllCategory: true });

      expect(result.find((item) => item.id === Category.ALL)).toBeDefined();
      expect(result.length).toBe(Object.values(Category).length);
    });

    it('기본값은 includeAllCategory가 false이다', () => {
      const result = makeCategoryList({});

      expect(result.find((item) => item.id === Category.ALL)).toBeUndefined();
    });
  });

  describe('lang 옵션', () => {
    it('lang이 kr이면 한국어 라벨을 반환한다', () => {
      const result = makeCategoryList({ lang: 'kr' });

      const vegetable = result.find((item) => item.id === Category.VEGETABLE);
      expect(vegetable?.label).toBe('채소');
    });

    it('lang이 en이면 영어 라벨을 반환한다', () => {
      const result = makeCategoryList({ lang: 'en' });

      const vegetable = result.find((item) => item.id === Category.VEGETABLE);
      expect(vegetable?.label).toBe('vegetable');
    });

    it('기본값은 lang이 kr이다', () => {
      const result = makeCategoryList({});

      const vegetable = result.find((item) => item.id === Category.VEGETABLE);
      expect(vegetable?.label).toBe('채소');
    });
  });

  describe('반환 형식', () => {
    it('각 항목은 id와 label을 가진다', () => {
      const result = makeCategoryList({});

      result.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('label');
      });
    });

    it('id는 Category enum 값이다', () => {
      const result = makeCategoryList({ includeAllCategory: true });
      const categoryValues = Object.values(Category);

      result.forEach((item) => {
        expect(categoryValues).toContain(item.id);
      });
    });
  });
});
