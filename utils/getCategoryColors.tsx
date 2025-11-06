import { CategoryType } from '@/constants/categories';

export function getCategoryColor(category: CategoryType): string {
  switch (category) {
    case 'vegetables':
      return '#047857';
    case 'fruits':
      return '#EF4444';
    case 'meat':
      return '#F97316';
    case 'seafood':
      return '#06B6D4';
    case 'dairy':
      return '#3B82F6';
    case 'processed':
      return '#F59E0B';
    case 'seasoning':
      return '#F59E0B';
    case 'etc':
      return '#6B7280';
    default:
      return '#6B7280';
  }
}
