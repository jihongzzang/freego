import { StatusType } from '@/constants/itemStatus';

/**
 * 유통기한 상태 계산
 */
export function calculateStatus(expiryDate: string | null | undefined): StatusType {
  if (!expiryDate) return 'not_set';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';
  return 'valid';
}
