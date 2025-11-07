import { StatusType } from '@/constants/itemStatus';
import { Colors } from '@/lib/theme';

export function getStatusColor(status: StatusType): string {
  const colors = Colors.light; // 컬러 토큰은 light/dark 동일

  switch (status) {
    case 'expired':
      return colors.danger; // 빨강 - 만료
    case 'valid':
      return colors.success; // 초록 - 유효
    case 'not_set':
      return colors.grey500; // 회색 - 미설정
    default:
      return colors.grey600;
  }
}
