/**
 * getStatusLabel Tests
 */

import { getStatusLabel } from '@/utils/status/getStatusLabel';

describe('getStatusLabel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('한국어 (기본)', () => {
    it('유통기한이 없으면 "미설정"을 반환한다', () => {
      expect(getStatusLabel({ expiryDate: null })).toBe('미설정');
    });

    it('유통기한이 지났으면 "소비기한 지남" 형식을 반환한다', () => {
      expect(getStatusLabel({ expiryDate: '2024-01-14' })).toBe('소비기한 지남 (D+1)');
      expect(getStatusLabel({ expiryDate: '2024-01-08' })).toBe('소비기한 지남 (D+7)');
    });

    it('유통기한이 남았으면 "D-N 남음" 형식을 반환한다', () => {
      expect(getStatusLabel({ expiryDate: '2024-01-15' })).toBe('D-0 남음');
      expect(getStatusLabel({ expiryDate: '2024-01-16' })).toBe('D-1 남음');
      expect(getStatusLabel({ expiryDate: '2024-01-22' })).toBe('D-7 남음');
    });
  });

  describe('영어', () => {
    it('유통기한이 없으면 "Not Set"을 반환한다', () => {
      expect(getStatusLabel({ expiryDate: null, lang: 'en' })).toBe('Not Set');
    });

    it('유통기한이 지났으면 영어 형식을 반환한다', () => {
      expect(getStatusLabel({ expiryDate: '2024-01-14', lang: 'en' })).toBe('1 day(s) past expiry');
      expect(getStatusLabel({ expiryDate: '2024-01-08', lang: 'en' })).toBe('7 day(s) past expiry');
    });

    it('유통기한이 남았으면 "D-N" 형식을 반환한다', () => {
      expect(getStatusLabel({ expiryDate: '2024-01-15', lang: 'en' })).toBe('D-0');
      expect(getStatusLabel({ expiryDate: '2024-01-16', lang: 'en' })).toBe('D-1');
    });
  });
});
