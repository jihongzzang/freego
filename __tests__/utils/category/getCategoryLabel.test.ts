/**
 * getCategoryLabel Tests
 */

import { getCategoryLabel } from '@/utils/category/getCategoryLabel';
import { Category } from '@/data/enums/category';

describe('getCategoryLabel', () => {
  describe('한국어 (기본)', () => {
    it('VEGETABLE 카테고리는 "채소"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.VEGETABLE })).toBe('채소');
    });

    it('FRUIT 카테고리는 "과일"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.FRUIT })).toBe('과일');
    });

    it('MEAT 카테고리는 "육류"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.MEAT })).toBe('육류');
    });

    it('SEAFOOD 카테고리는 "해산물"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.SEAFOOD })).toBe('해산물');
    });

    it('DAIRY 카테고리는 "유제품"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.DAIRY })).toBe('유제품');
    });

    it('PROCESSED 카테고리는 "가공식품"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.PROCESSED })).toBe('가공식품');
    });

    it('SEASONING 카테고리는 "조미료"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.SEASONING })).toBe('조미료');
    });

    it('OTHER 카테고리는 "기타"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.OTHER })).toBe('기타');
    });

    it('ALL 카테고리는 "전체"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.ALL })).toBe('전체');
    });

    it('null 카테고리는 "전체"를 반환한다', () => {
      expect(getCategoryLabel({ category: null })).toBe('전체');
    });
  });

  describe('영어', () => {
    it('VEGETABLE 카테고리는 "vegetable"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.VEGETABLE, lang: 'en' })).toBe('vegetable');
    });

    it('FRUIT 카테고리는 "fruit"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.FRUIT, lang: 'en' })).toBe('fruit');
    });

    it('MEAT 카테고리는 "meat"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.MEAT, lang: 'en' })).toBe('meat');
    });

    it('SEAFOOD 카테고리는 "seafood"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.SEAFOOD, lang: 'en' })).toBe('seafood');
    });

    it('DAIRY 카테고리는 "dairy"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.DAIRY, lang: 'en' })).toBe('dairy');
    });

    it('PROCESSED 카테고리는 "processed"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.PROCESSED, lang: 'en' })).toBe('processed');
    });

    it('SEASONING 카테고리는 "seasoning"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.SEASONING, lang: 'en' })).toBe('seasoning');
    });

    it('OTHER 카테고리는 "other"를 반환한다', () => {
      expect(getCategoryLabel({ category: Category.OTHER, lang: 'en' })).toBe('other');
    });

    it('null 카테고리는 "all"를 반환한다', () => {
      expect(getCategoryLabel({ category: null, lang: 'en' })).toBe('all');
    });
  });
});
