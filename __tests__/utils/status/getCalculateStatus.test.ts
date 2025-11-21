/**
 * getCalculateStatus Tests
 */

import { getCalculateStatus } from '@/utils/status/getCalculateStatus';

describe('getCalculateStatus', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('유통기한이 없는 경우', () => {
    it('null이면 "not_set"을 반환한다', () => {
      expect(getCalculateStatus(null)).toBe('not_set');
    });
  });

  describe('유통기한이 지난 경우', () => {
    it('1일 지났으면 "expired"를 반환한다', () => {
      expect(getCalculateStatus('2024-01-14')).toBe('expired');
    });

    it('7일 지났으면 "expired"를 반환한다', () => {
      expect(getCalculateStatus('2024-01-08')).toBe('expired');
    });
  });

  describe('경고 범위 (0~3일 남음)', () => {
    it('오늘이면 "warning"을 반환한다', () => {
      expect(getCalculateStatus('2024-01-15')).toBe('warning');
    });

    it('1일 남았으면 "warning"을 반환한다', () => {
      expect(getCalculateStatus('2024-01-16')).toBe('warning');
    });

    it('3일 남았으면 "warning"을 반환한다', () => {
      expect(getCalculateStatus('2024-01-18')).toBe('warning');
    });
  });

  describe('유효 범위 (4일 이상 남음)', () => {
    it('4일 남았으면 "valid"를 반환한다', () => {
      expect(getCalculateStatus('2024-01-19')).toBe('valid');
    });

    it('30일 남았으면 "valid"를 반환한다', () => {
      expect(getCalculateStatus('2024-02-14')).toBe('valid');
    });
  });
});
