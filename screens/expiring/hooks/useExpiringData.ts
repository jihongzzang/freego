export function useExpiringData() {
  const getDaysRemaining = (daysRemaining: number | null): string => {
    if (daysRemaining === null) return '';

    if (daysRemaining < 0) return '만료됨';
    if (daysRemaining === 0) return '오늘';
    if (daysRemaining === 1) return '내일';
    return `${daysRemaining}일 남음`;
  };

  return {
    getDaysRemaining,
  };
}
