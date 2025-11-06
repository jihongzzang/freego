import { StatusType } from '@/constants/itemStatus';

export function getStatusColor(status: StatusType): string {
  switch (status) {
    case 'expired':
      return '#10B981';
    case 'valid':
      return '#F04452';
    case 'not_set':
      return '#9CA3AF';
    default:
      return '#6B7280';
  }
}
