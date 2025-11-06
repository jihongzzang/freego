import { StatusType } from '@/constants/itemStatus';

export function getStatusColor(status: StatusType): string {
  switch (status) {
    case 'expired':
      return '#F04452';
    case 'valid':
      return '#10B981';
    case 'not_set':
      return '#9CA3AF';
    default:
      return '#6B7280';
  }
}
