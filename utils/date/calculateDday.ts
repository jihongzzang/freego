/**
 * 유통기한 D-day 계산
 * @param expirationDate 유통기한 (YYYY-MM-DD)
 * @returns D-day 문자열 (예: "D+3", "D-1", "D-day")
 */
export function calculateDday(expirationDate?: string | null): string {
  if (!expirationDate) return '-';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expDate = new Date(expirationDate);
  expDate.setHours(0, 0, 0, 0);

  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays > 0) return `D+${diffDays}`;
  return `D${diffDays}`;
}

/**
 * D-day 값에 따른 색상 반환
 * @param dday D-day 문자열
 * @returns color type: 'safe' | 'warning' | 'danger'
 */
export function getDdayColor(dday: string): 'none' | 'safe' | 'warning' | 'danger' {
  if (dday === '-') return 'none';

  if (dday === '오늘') return 'warning';

  const match = dday.match(/D([+-]\d+)/);
  if (!match) return 'safe';

  const days = parseInt(match[1]);
  if (days < 0) return 'danger';
  if (days <= 3) return 'warning';
  return 'safe';
}
