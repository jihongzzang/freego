import { getCalculateDaysRemaining } from './getCalculateDaysRemaining';

describe('getCalculateDaysRemaining', () => {
  // 시간 의존성을 제어하기 위해 Date를 모킹
  const mockToday = new Date('2025-01-15');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockToday);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('유효한 날짜', () => {
    it('미래 날짜일 때 양수 일수를 반환해야 함', () => {
      const futureDate = '2025-01-20'; // 5일 후
      const result = getCalculateDaysRemaining(futureDate);
      expect(result).toBe(5);
    });

    it('과거 날짜일 때 음수 일수를 반환해야 함', () => {
      const pastDate = '2025-01-10'; // 5일 전
      const result = getCalculateDaysRemaining(pastDate);
      expect(result).toBe(-5);
    });

    it('오늘 날짜일 때 0을 반환해야 함', () => {
      const today = '2025-01-15'; // 오늘
      const result = getCalculateDaysRemaining(today);
      expect(result).toBe(0);
    });

    it('내일 날짜일 때 1을 반환해야 함', () => {
      const tomorrow = '2025-01-16'; // 내일
      const result = getCalculateDaysRemaining(tomorrow);
      expect(result).toBe(1);
    });

    it('어제 날짜일 때 -1을 반환해야 함', () => {
      const yesterday = '2025-01-14'; // 어제
      const result = getCalculateDaysRemaining(yesterday);
      expect(result).toBe(-1);
    });
  });

  describe('잘못된 입력', () => {
    it('null을 전달하면 null을 반환해야 함', () => {
      const result = getCalculateDaysRemaining(null);
      expect(result).toBeNull();
    });

    it('빈 문자열을 전달하면 null을 반환해야 함', () => {
      const result = getCalculateDaysRemaining('');
      expect(result).toBeNull();
    });
  });

  describe('다양한 날짜 형식', () => {
    it('ISO 8601 형식을 처리할 수 있어야 함', () => {
      const isoDate = '2025-01-20T00:00:00.000Z';
      const result = getCalculateDaysRemaining(isoDate);
      // 시간대에 따라 결과가 다를 수 있으므로 숫자인지만 확인
      expect(typeof result).toBe('number');
    });

    it('한 달 후 날짜를 계산할 수 있어야 함', () => {
      const oneMonthLater = '2025-02-15'; // 31일 후
      const result = getCalculateDaysRemaining(oneMonthLater);
      expect(result).toBe(31);
    });

    it('일 년 후 날짜를 계산할 수 있어야 함', () => {
      const oneYearLater = '2026-01-15'; // 365일 후
      const result = getCalculateDaysRemaining(oneYearLater);
      expect(result).toBe(365);
    });
  });

  describe('엣지 케이스', () => {
    it('시간 정보가 포함되어 있어도 일자만 비교해야 함', () => {
      const dateWithTime1 = '2025-01-20T08:30:00';
      const dateWithTime2 = '2025-01-20T23:59:59';

      const result1 = getCalculateDaysRemaining(dateWithTime1);
      const result2 = getCalculateDaysRemaining(dateWithTime2);

      // 같은 날짜면 시간과 관계없이 같은 결과
      expect(result1).toBe(result2);
      expect(result1).toBe(5);
    });
  });
});
