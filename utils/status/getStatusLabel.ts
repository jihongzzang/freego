export function getStatusLabel({
  expiryDate,
  lang = 'kr',
}: {
  expiryDate?: string | null;
  lang?: 'kr' | 'en';
}): string {
  if (!expiryDate) return lang === 'kr' ? '미설정' : 'Not Set';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return lang === 'kr' ? '만료' : 'Expired';
  return lang === 'kr' ? '유효' : 'Valid';
}
