import { Colors } from '@/lib/theme';
import { StatusType } from '@/data/enums/status';

export function getStatusColor(status: StatusType): string {
  const colors = Colors.dark; // light/dark 동일 토큰 사용

  // 미설정
  if (status === 'not_set') return colors.grey500;

  // 만료 / 유효
  if (status === 'expired') return colors.danger; // expired

  return colors.success; // valid
}
