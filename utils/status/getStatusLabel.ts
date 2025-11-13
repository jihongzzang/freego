export function getStatusLabel({ expiryDate, lang = 'kr' }: { expiryDate: string | null; lang?: 'kr' | 'en' }): string {
  if (!expiryDate) return lang === 'kr' ? '미설정' : 'Not Set';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0)
    return lang === 'kr' ? `소비기한 지남 (D+${Math.abs(diffDays)})` : `${Math.abs(diffDays)} day(s) past expiry`;

  return lang === 'kr' ? `D-${diffDays} 남음` : `D-${diffDays}`;
}
