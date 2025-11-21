/**
 * toLocalDate Tests
 */

import { toLocalDate } from '@/utils/time/toLocalDate';

describe('toLocalDate', () => {
  it('ISO 8601 형식을 YYYY-MM-DD로 변환한다', () => {
    expect(toLocalDate('2024-01-15T10:30:00.000Z')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('날짜 문자열을 YYYY-MM-DD 형식으로 변환한다', () => {
    const result = toLocalDate('2024-01-15');
    expect(result).toBe('2024-01-15');
  });

  it('월이 한 자리수면 0을 패딩한다', () => {
    const result = toLocalDate('2024-03-05');
    expect(result).toBe('2024-03-05');
  });

  it('일이 한 자리수면 0을 패딩한다', () => {
    const result = toLocalDate('2024-11-01');
    expect(result).toBe('2024-11-01');
  });
});
