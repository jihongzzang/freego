import { CategoryType } from '@/constants/categories';
import { Colors } from '@/lib/theme';

export function getCategoryColor(category: CategoryType): string {
  const colors = Colors.light; // 컬러 토큰은 light/dark 동일

  switch (category) {
    case 'vegetables':
      return colors.green600; // 초록 - 채소
    case 'fruits':
      return colors.red500; // 빨강 - 과일
    case 'meat':
      return colors.orange600; // 주황 - 고기
    case 'seafood':
      return colors.teal500; // 청록 - 해산물
    case 'dairy':
      return colors.blue500; // 파랑 - 유제품
    case 'processed':
      return colors.yellow600; // 노랑 - 가공식품
    case 'seasoning':
      return colors.orange500; // 주황 - 조미료
    case 'etc':
      return colors.grey600; // 회색 - 기타
    default:
      return colors.grey600;
  }
}
