import { Category } from '@/data/enums/category';

import { Colors } from '@/lib/theme';

export function getCategoryColor(category: Category): string {
  const colors = Colors.light; // 컬러 토큰은 light/dark 동일

  switch (category) {
    case Category.VEGETABLE:
      return colors.green900; // 초록 - 채소
    case Category.FRUIT:
      return colors.red600; // 빨강 - 과일
    case Category.MEAT:
      return colors.orange600; // 주황 - 고기
    case Category.SEAFOOD:
      return colors.teal600; // 청록 - 해산물
    case Category.DAIRY:
      return colors.blue600; // 파랑 - 유제품
    case Category.PROCESSED:
      return colors.yellow600; // 노랑 - 가공식품
    case Category.SEASONING:
      return colors.orange600; // 주황 - 조미료
    case Category.OTHER:
      return colors.grey600; // 회색 - 기타
    default:
      return colors.grey600;
  }
}
