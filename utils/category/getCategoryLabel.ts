import { Category } from '@/data/enums/category';

export function getCategoryLabel({ category, lang = 'kr' }: { category: Category | null; lang?: 'kr' | 'en' }): string {
  const map: Record<Category, { kr: string; en: string }> = {
    [Category.VEGETABLE]: { kr: '채소', en: 'vegetable' },
    [Category.FRUIT]: { kr: '과일', en: 'fruit' },
    [Category.MEAT]: { kr: '육류', en: 'meat' },
    [Category.SEAFOOD]: { kr: '해산물', en: 'seafood' },
    [Category.DAIRY]: { kr: '유제품', en: 'dairy' },
    [Category.PROCESSED]: { kr: '가공식품', en: 'processed' },
    [Category.SEASONING]: { kr: '조미료', en: 'seasoning' },
    [Category.OTHER]: { kr: '기타', en: 'other' },
  };

  if (!category) return lang == 'kr' ? '전체' : 'all';

  return map[category][lang];
}
