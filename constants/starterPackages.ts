/**
 * 라이프스타일별 스타터 패키지
 */

import { Category } from '@/data/enums/category';
import { ingredientTemplates, IngredientTemplate } from './ingredientTemplates';
import { Unit } from '@/data/enums/unit';
import { StorageLocation } from '@/data/enums/storage_location';

export interface PackageIngredient {
  id: string;
  name: string;
  category: Category;
  quantity: number | null;
  unit: Unit;
  emoji: string;
  memo: string | null;
  storage_location: StorageLocation | null;
  purchased_date_time: string | null;
  expired_date_time: string | null;
  last_modified_date_time?: string | null;
  deleted_date_time?: string | null;
}

export interface LifestylePackage {
  id: string;
  krLabel: string;
  enLabel: string;
  description: string;
  icon: string;
  ingredients: PackageIngredient[];
}

/**
 * 재료 이름으로 템플릿 찾기
 */
function findTemplateById(id: string): IngredientTemplate {
  return ingredientTemplates.find((t) => t.id === id)!;
}

export type SupportedLang = 'ko' | 'en';

/**
 * 간편하게 재료 생성 (이름만 입력, 수량은 선택)
 */
function ingredient({
  id,
  quantity,
  overrides,
  lang = 'ko',
}: {
  id: string;
  quantity?: number;
  overrides?: Partial<PackageIngredient>;
  lang?: SupportedLang;
}): PackageIngredient {
  const template = findTemplateById(id);

  // 템플릿에서 기본값 가져오기
  return {
    id: id,
    name: lang === 'ko' ? template.krLabel : template.enLabel,
    category: template.category,
    quantity: quantity ?? null,
    emoji: template.emoji,
    unit: template.defaultUnit,
    storage_location: null,
    memo: null,
    purchased_date_time: null,
    expired_date_time: null,
    last_modified_date_time: null,
    deleted_date_time: null,
    ...overrides,
  };
}

/**
 * 라이프스타일 패키지 목록 (언어별 동적 생성)
 */
export function getLifestylePackages(lang: SupportedLang = 'ko'): LifestylePackage[] {
  return [
    {
      id: 'single',
      krLabel: '1인 가구',
      enLabel: 'Single Household',
      description: '혼자 살면서 기본적인 요리를 하는 분들을 위한 패키지',
      icon: '👤',
      ingredients: [
        ingredient({ id: 'egg', lang }),
        ingredient({ id: 'milk', lang }),
        ingredient({ id: 'white_bread', overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
        ingredient({ id: 'onion', quantity: 2, overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
        ingredient({ id: 'garlic', quantity: 1, overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
        ingredient({ id: 'green_onion', quantity: 1, lang }),
        ingredient({ id: 'carrot', quantity: 3, lang }),
        ingredient({ id: 'potato', quantity: 5, overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
        ingredient({ id: 'kimchi', quantity: 1, lang }),
        ingredient({ id: 'sesame_oil', quantity: 1, overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
        ingredient({ id: 'soy_sauce', quantity: 1, overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
        ingredient({ id: 'gochujang', quantity: 1, lang }),
      ],
    },
    {
      id: 'office_worker',
      krLabel: '바쁜 직장인',
      enLabel: 'Busy Worker',
      description: '간편하게 식사를 해결하는 직장인을 위한 패키지',
      icon: '💼',
      ingredients: [
        ingredient({ id: 'instant_cooked_rice', overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
        ingredient({ id: 'egg', lang }),
        ingredient({ id: 'ham', lang }),
        ingredient({ id: 'cheese', lang }),
        ingredient({ id: 'kimchi', lang }),
        ingredient({ id: 'milk', lang }),
        ingredient({ id: 'yogurt', lang }),
        ingredient({ id: 'cherry_tomatoes', lang }),
        ingredient({ id: 'salad', lang }),
        ingredient({ id: 'frozen_dumplings', overrides: { storage_location: StorageLocation.FREEZER }, lang }),
      ],
    },
    {
      id: 'healthy',
      krLabel: '건강 식단',
      enLabel: 'Healthy Diet',
      description: '건강하고 깨끗한 식단을 선호하는 분들을 위한 패키지',
      icon: '🥗',
      ingredients: [
        ingredient({ id: 'chicken_breast', overrides: { storage_location: StorageLocation.FREEZER }, lang }),
        ingredient({ id: 'broccoli', lang }),
        ingredient({ id: 'spinach', lang }),
        ingredient({ id: 'tomato', lang }),
        ingredient({ id: 'avocado', lang }),
        ingredient({ id: 'greek_yogurt', lang }),
        ingredient({ id: 'salmon', overrides: { storage_location: StorageLocation.FREEZER }, lang }),
        ingredient({ id: 'sweet_potato', overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
        ingredient({ id: 'blueberry', lang }),
      ],
    },
    {
      id: 'family',
      krLabel: '가족 단위',
      enLabel: 'Family',
      description: '온 가족이 함께 식사하는 가정을 위한 패키지',
      icon: '👨‍👩‍👧‍👦',
      ingredients: [
        ingredient({ id: 'rice', overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
        ingredient({ id: 'egg', lang }),
        ingredient({ id: 'milk', lang }),
        ingredient({ id: 'onion', overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
        ingredient({ id: 'potato', overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
        ingredient({ id: 'carrot', lang }),
        ingredient({ id: 'pork', overrides: { storage_location: StorageLocation.FREEZER }, lang }),
        ingredient({ id: 'chicken', overrides: { storage_location: StorageLocation.FREEZER }, lang }),
        ingredient({ id: 'tofu', lang }),
        ingredient({ id: 'kimchi', lang }),
        ingredient({ id: 'green_onion', lang }),
        ingredient({ id: 'garlic', overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
      ],
    },
    {
      id: 'beginner',
      krLabel: '자취 초보',
      enLabel: 'Beginner',
      description: '처음 자취를 시작하는 분들을 위한 기본 패키지',
      icon: '🔰',
      ingredients: [
        ingredient({ id: 'ramen', overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
        ingredient({ id: 'instant_cooked_rice', overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
        ingredient({ id: 'egg', lang }),
        ingredient({ id: 'onion', overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
        ingredient({ id: 'green_onion', lang }),
        ingredient({ id: 'kimchi', lang }),
        ingredient({ id: 'milk', lang }),
        ingredient({ id: 'white_bread', overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
        ingredient({ id: 'butter', lang }),
        ingredient({ id: 'tuna_can', overrides: { storage_location: StorageLocation.ROOM_TEMPERATURE }, lang }),
      ],
    },
  ];
}

/** @deprecated Use getLifestylePackages(lang) instead */
export const LIFESTYLE_PACKAGES: LifestylePackage[] = getLifestylePackages('ko');

export function findLifestylePackageById(id: string, lang: SupportedLang = 'ko'): LifestylePackage | undefined {
  return getLifestylePackages(lang).find((pkg) => pkg.id === id);
}
