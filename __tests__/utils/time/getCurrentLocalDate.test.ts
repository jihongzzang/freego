/**
 * getCurrentLocalDate Tests
 */

import { getCurrentLocalDate } from '@/utils/time/getCurrentLocalDate';

describe('getCurrentLocalDate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('현재 날짜를 YYYY-MM-DD 형식으로 반환한다', () => {
    jest.setSystemTime(new Date('2024-01-15T10:30:00'));
    expect(getCurrentLocalDate()).toBe('2024-01-15');
  });

  it('월이 한 자리수면 0을 패딩한다', () => {
    jest.setSystemTime(new Date('2024-03-05T10:30:00'));
    expect(getCurrentLocalDate()).toBe('2024-03-05');
  });

  it('일이 한 자리수면 0을 패딩한다', () => {
    jest.setSystemTime(new Date('2024-11-01T10:30:00'));
    expect(getCurrentLocalDate()).toBe('2024-11-01');
  });

  it('연말 날짜를 올바르게 반환한다', () => {
    jest.setSystemTime(new Date('2024-12-31T23:59:59'));
    expect(getCurrentLocalDate()).toBe('2024-12-31');
  });

  it('연초 날짜를 올바르게 반환한다', () => {
    jest.setSystemTime(new Date('2024-01-01T00:00:00'));
    expect(getCurrentLocalDate()).toBe('2024-01-01');
  });
});
