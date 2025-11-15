import { Category } from '@/data/enums/category';

import { getCategoryLabel } from './getCategoryLabel';

interface MakeCategoryListOptions {
  includeAllCategory?: boolean; // "전체" 포함 여부
  lang?: 'kr' | 'en'; // 언어 선택
}

export function makeCategoryList({ includeAllCategory = false, lang = 'kr' }: MakeCategoryListOptions) {
  const categories = Object.values(Category).map((category) => ({
    id: category as Category,
    label: getCategoryLabel({ category: category as Category, lang }),
  }));

  if (!includeAllCategory) {
    return categories.slice(1);
  }

  return categories;
}
