/**
 * makeUnitList Tests
 */

import { makeUnitList } from '@/utils/unit/makeUnitList';
import { Unit } from '@/data/enums/unit';

describe('makeUnitList', () => {
  describe('lang 옵션', () => {
    it('lang이 kr이면 한국어 라벨을 반환한다', () => {
      const result = makeUnitList({ lang: 'kr' });

      const piece = result.find((item) => item.id === Unit.PIECE);
      expect(piece?.label).toBe('개');
    });

    it('lang이 en이면 영어 라벨을 반환한다', () => {
      const result = makeUnitList({ lang: 'en' });

      const piece = result.find((item) => item.id === Unit.PIECE);
      expect(piece?.label).toBe('piece');
    });

    it('기본값은 lang이 kr이다', () => {
      const result = makeUnitList();

      const piece = result.find((item) => item.id === Unit.PIECE);
      expect(piece?.label).toBe('개');
    });
  });

  describe('반환 형식', () => {
    it('모든 Unit을 포함한다', () => {
      const result = makeUnitList();
      const unitValues = Object.values(Unit);

      expect(result.length).toBe(unitValues.length);
      unitValues.forEach((unit) => {
        expect(result.find((item) => item.id === unit)).toBeDefined();
      });
    });

    it('각 항목은 id와 label을 가진다', () => {
      const result = makeUnitList();

      result.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('label');
      });
    });

    it('id는 Unit enum 값이다', () => {
      const result = makeUnitList();
      const unitValues = Object.values(Unit);

      result.forEach((item) => {
        expect(unitValues).toContain(item.id);
      });
    });
  });
});
