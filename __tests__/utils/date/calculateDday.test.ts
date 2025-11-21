/**
 * calculateDday & getDdayColor Tests
 */

import { calculateDday, getDdayColor } from '@/utils/date/calculateDday';

describe('calculateDday', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('유통기한이 없는 경우', () => {
    it('null이면 "-"를 반환한다', () => {
      expect(calculateDday(null)).toBe('-');
    });

    it('undefined이면 "-"를 반환한다', () => {
      expect(calculateDday(undefined)).toBe('-');
    });
  });

  describe('유통기한이 오늘인 경우', () => {
    it('"오늘"을 반환한다', () => {
      expect(calculateDday('2024-01-15')).toBe('오늘');
    });
  });

  describe('유통기한이 지난 경우', () => {
    it('1일 지났으면 "D-1"을 반환한다', () => {
      expect(calculateDday('2024-01-14')).toBe('D-1');
    });

    it('7일 지났으면 "D-7"을 반환한다', () => {
      expect(calculateDday('2024-01-08')).toBe('D-7');
    });
  });

  describe('유통기한이 남은 경우', () => {
    it('1일 남았으면 "D+1"을 반환한다', () => {
      expect(calculateDday('2024-01-16')).toBe('D+1');
    });

    it('7일 남았으면 "D+7"을 반환한다', () => {
      expect(calculateDday('2024-01-22')).toBe('D+7');
    });

    it('30일 남았으면 "D+30"을 반환한다', () => {
      expect(calculateDday('2024-02-14')).toBe('D+30');
    });
  });
});

describe('getDdayColor', () => {
  describe('미설정', () => {
    it('"-"이면 "none"을 반환한다', () => {
      expect(getDdayColor('-')).toBe('none');
    });
  });

  describe('오늘', () => {
    it('"오늘"이면 "warning"을 반환한다', () => {
      expect(getDdayColor('오늘')).toBe('warning');
    });
  });

  describe('만료된 경우', () => {
    it('"D-1"이면 "danger"를 반환한다', () => {
      expect(getDdayColor('D-1')).toBe('danger');
    });

    it('"D-7"이면 "danger"를 반환한다', () => {
      expect(getDdayColor('D-7')).toBe('danger');
    });
  });

  describe('경고 범위', () => {
    it('"D+1"이면 "warning"을 반환한다', () => {
      expect(getDdayColor('D+1')).toBe('warning');
    });

    it('"D+3"이면 "warning"을 반환한다', () => {
      expect(getDdayColor('D+3')).toBe('warning');
    });
  });

  describe('안전 범위', () => {
    it('"D+4"이면 "safe"를 반환한다', () => {
      expect(getDdayColor('D+4')).toBe('safe');
    });

    it('"D+30"이면 "safe"를 반환한다', () => {
      expect(getDdayColor('D+30')).toBe('safe');
    });
  });

  describe('edge case', () => {
    it('잘못된 형식이면 "safe"를 반환한다', () => {
      expect(getDdayColor('invalid')).toBe('safe');
    });
  });
});
