/**
 * getDaysRemaining Tests
 */

import { getDaysRemaining } from '@/utils/time/getDaysRemaining';

describe('getDaysRemaining', () => {
  describe('null인 경우', () => {
    it('빈 문자열을 반환한다', () => {
      expect(getDaysRemaining(null)).toBe('');
    });
  });

  describe('유통기한이 지난 경우', () => {
    it('1일 지났으면 "1일 지남"을 반환한다', () => {
      expect(getDaysRemaining(-1)).toBe('1일 지남');
    });

    it('7일 지났으면 "7일 지남"을 반환한다', () => {
      expect(getDaysRemaining(-7)).toBe('7일 지남');
    });
  });

  describe('오늘인 경우', () => {
    it('0이면 "오늘"을 반환한다', () => {
      expect(getDaysRemaining(0)).toBe('오늘');
    });
  });

  describe('내일인 경우', () => {
    it('1이면 "내일"을 반환한다', () => {
      expect(getDaysRemaining(1)).toBe('내일');
    });
  });

  describe('유통기한이 남은 경우', () => {
    it('2일 남았으면 "2일 남음"을 반환한다', () => {
      expect(getDaysRemaining(2)).toBe('2일 남음');
    });

    it('30일 남았으면 "30일 남음"을 반환한다', () => {
      expect(getDaysRemaining(30)).toBe('30일 남음');
    });
  });
});
