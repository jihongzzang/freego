export function getDaysRemaining(daysRemaining: number | null): string {
  if (daysRemaining === null) return '';

  if (daysRemaining < 0) return `${Math.abs(daysRemaining)}일 지남`;
  if (daysRemaining === 0) return '오늘';
  if (daysRemaining === 1) return '내일';
  return `${daysRemaining}일 남음`;
}
