import { StatusType } from '@/data/enums/status';

export function getCalculateStatus(expiryDate?: string | null): StatusType {
  if (!expiryDate) return 'not_set';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';

  if (diffDays < 4) return 'warning';

  return 'valid';
}
