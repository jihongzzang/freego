/**
 * getUnitLabel Tests
 */

import { getUnitLabel } from '@/utils/unit/getUnitLabel';
import { Unit } from '@/data/enums/unit';

describe('getUnitLabel', () => {
  describe('한국어 (기본)', () => {
    it('PIECE는 "개"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.PIECE })).toBe('개');
    });

    it('GRAM은 "g"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.GRAM })).toBe('g');
    });

    it('KILOGRAM은 "kg"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.KILOGRAM })).toBe('kg');
    });

    it('MILLILITER는 "ml"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.MILLILITER })).toBe('ml');
    });

    it('LITER는 "L"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.LITER })).toBe('L');
    });

    it('PACK은 "팩"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.PACK })).toBe('팩');
    });

    it('BUNCH는 "묶음"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.BUNCH })).toBe('묶음');
    });

    it('WHOLE은 "마리"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.WHOLE })).toBe('마리');
    });

    it('EGG는 "알"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.EGG })).toBe('알');
    });

    it('SLICE는 "조각"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.SLICE })).toBe('조각');
    });

    it('HEAD는 "포기"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.HEAD })).toBe('포기');
    });

    it('SHEET는 "장"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.SHEET })).toBe('장');
    });

    it('CLUSTER는 "송이"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.CLUSTER })).toBe('송이');
    });

    it('CAN은 "캔"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.CAN })).toBe('캔');
    });

    it('PLANT는 "모"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.PLANT })).toBe('모');
    });
  });

  describe('영어', () => {
    it('PIECE는 "piece"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.PIECE, lang: 'en' })).toBe('piece');
    });

    it('GRAM은 "gram"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.GRAM, lang: 'en' })).toBe('gram');
    });

    it('KILOGRAM은 "kilogram"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.KILOGRAM, lang: 'en' })).toBe('kilogram');
    });

    it('MILLILITER는 "milliliter"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.MILLILITER, lang: 'en' })).toBe('milliliter');
    });

    it('LITER는 "liter"를 반환한다', () => {
      expect(getUnitLabel({ unit: Unit.LITER, lang: 'en' })).toBe('liter');
    });
  });
});
