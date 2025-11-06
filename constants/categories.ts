/**
 * 재료 카테고리 상수
 */

export interface CategoryItem {
  id: CategoryType;
  value: string;
  krLabel: string;
  enLabel: string;
}

export const CATEGORIES = [
  {
    id: 'vegetables',
    value: 'vegetables',
    krLabel: '채소',
    enLabel: 'vegetables',
  },
  { id: 'fruits', value: 'fruits', krLabel: '과일', enLabel: 'fruits' },
  { id: 'meat', value: 'meat', krLabel: '육류', enLabel: 'meat' },
  { id: 'seafood', value: 'seafood', krLabel: '생선류', enLabel: 'seafood' },
  { id: 'dairy', value: 'dairy', krLabel: '유제품', enLabel: 'dairy' },
  {
    id: 'processed',
    value: 'processed',
    krLabel: '가공식품',
    enLabel: 'processed',
  },
  {
    id: 'seasoning',
    value: 'seasoning',
    krLabel: '조미료',
    enLabel: 'seasoning',
  },
  { id: 'etc', value: 'etc', krLabel: '기타', enLabel: 'etc' },
] as const;

// ✅ CategoryType 자동 추론 (any 방지)
export type CategoryType = (typeof CATEGORIES)[number]['id'];

// ✅ “전체” 카테고리 추가
export const ALL_CATEGORY = {
  id: 'all',
  value: 'all',
  krLabel: '전체',
  enLabel: 'all',
} as const;

// ✅ 전체 포함 배열
export const ALL_CATEGORIES = [ALL_CATEGORY, ...CATEGORIES] as const;

// ✅ AllCategoryType 자동 추론
export type AllCategoryType = (typeof ALL_CATEGORIES)[number]['id'];

// ✅ 안전한 find 함수 (undefined 불가)
export const findCategoryById = (id: AllCategoryType): CategoryItem =>
  ALL_CATEGORIES.find((cat) => cat.id === id)! as CategoryItem;
