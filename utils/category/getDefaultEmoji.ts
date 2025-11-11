import { Category } from '@/data/enums/category';

/**
 * 카테고리별 기본 이모지 반환
 */
export function getDefaultEmoji(category: Category): string {
  switch (category) {
    case Category.VEGETABLE:
      return '🥬';
    case Category.FRUIT:
      return '🍎';
    case Category.MEAT:
      return '🥩';
    case Category.SEAFOOD:
      return '🐟';
    case Category.DAIRY:
      return '🥛';
    case Category.PROCESSED:
      return '🥫';
    case Category.SEASONING:
      return '🧂';
    case Category.OTHER:
      return '📦';
    default:
      return '📦';
  }
}
