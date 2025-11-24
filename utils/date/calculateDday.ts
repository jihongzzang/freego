import i18n from '@/locales';

/**
 * 유통기한 D-day 계산
 * @param expirationDate 유통기한 (YYYY-MM-DD)
 * @returns D-day 문자열 (예: "D+3", "D-1", "오늘/Today")
 */
export function calculateDday(expirationDate?: string | null): string {
  if (!expirationDate) return '-';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expDate = new Date(expirationDate);
  expDate.setHours(0, 0, 0, 0);

  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return i18n.t('common.today');
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

  // 다국어 지원: '오늘' 또는 'Today' 모두 처리
  const todayLabel = i18n.t('common.today');
  if (dday === todayLabel) return 'warning';

  const match = dday.match(/D([+-]\d+)/);
  if (!match) return 'safe';

  const days = parseInt(match[1]);
  if (days < 0) return 'danger';
  if (days <= 3) return 'warning';
  return 'safe';
}
