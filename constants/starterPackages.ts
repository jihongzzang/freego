/**
 * 라이프스타일별 스타터 패키지
 */

import { CategoryType } from './categories';
import { StorageLocationType } from './storageLocations';
import { UnitType } from './units';
import { ingredientTemplates, IngredientTemplate } from './ingredientTemplates';

export interface PackageIngredient {
  id: string;
  name: string;
  category: CategoryType;
  quantity?: number;
  unit?: UnitType;
  emoji: string;
  storage_location: StorageLocationType;
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

/**
 * 간편하게 재료 생성 (이름만 입력, 수량은 선택)
 */
function ingredient({
  id,
  quantity,
  overrides,
}: {
  id: string;
  quantity?: number;
  overrides?: Partial<PackageIngredient>;
}): PackageIngredient {
  const template = findTemplateById(id);

  // 템플릿에서 기본값 가져오기
  return {
    id: id,
    name: template.krLabel,
    category: template.category,
    quantity,
    emoji: template.emoji,
    unit: quantity ? template.defaultUnit : undefined,
    storage_location: 'fridge', // 기본값
    ...overrides, // 수동 오버라이드
  };
}

export const LIFESTYLE_PACKAGES: LifestylePackage[] = [
  {
    id: 'single',
    krLabel: '1인 가구',
    enLabel: 'Single Household',
    description: '혼자 살면서 기본적인 요리를 하는 분들을 위한 패키지',
    icon: '👤',
    ingredients: [
      ingredient({ id: 'egg' }),
      ingredient({ id: 'milk' }),
      ingredient({ id: 'white_bread', overrides: { storage_location: 'room_temp' } }),
      ingredient({ id: 'onion', quantity: 2, overrides: { storage_location: 'room_temp' } }),
      ingredient({ id: 'garlic', quantity: 1, overrides: { storage_location: 'room_temp' } }),
      ingredient({ id: 'green_onion', quantity: 1 }),
      ingredient({ id: 'carrot', quantity: 3 }),
      ingredient({ id: 'potato', quantity: 5, overrides: { storage_location: 'room_temp' } }),
      ingredient({ id: 'kimchi', quantity: 1 }),
      ingredient({ id: 'sesame_oil', quantity: 1, overrides: { storage_location: 'room_temp' } }),
      ingredient({ id: 'soy_sauce', quantity: 1, overrides: { storage_location: 'room_temp' } }),
      ingredient({ id: 'gochujang', quantity: 1 }),
    ],
  },
  {
    id: 'office_worker',
    krLabel: '바쁜 직장인',
    enLabel: 'Busy Worker',
    description: '간편하게 식사를 해결하는 직장인을 위한 패키지',
    icon: '💼',
    ingredients: [
      ingredient({ id: 'instant_cooked_rice', overrides: { storage_location: 'room_temp' } }),
      ingredient({ id: 'egg' }),
      ingredient({ id: 'ham' }),
      ingredient({ id: 'cheese' }),
      ingredient({ id: 'kimchi' }),
      ingredient({ id: 'milk' }),
      ingredient({ id: 'yogurt' }),
      ingredient({ id: 'cherry_tomatoes' }),
      ingredient({ id: 'salad' }),
      ingredient({ id: 'frozen_dumplings', overrides: { storage_location: 'freezer' } }),
    ],
  },
  {
    id: 'healthy',
    krLabel: '건강 식단',
    enLabel: 'Healthy Diet',
    description: '건강하고 깨끗한 식단을 선호하는 분들을 위한 패키지',
    icon: '🥗',
    ingredients: [
      ingredient({ id: 'chicken_breast', overrides: { storage_location: 'freezer' } }),
      ingredient({ id: 'broccoli' }),
      ingredient({ id: 'spinach' }),
      ingredient({ id: 'tomato' }),
      ingredient({ id: 'avocado' }),
      ingredient({ id: 'greek_yogurt' }),
      ingredient({ id: 'salmon', overrides: { storage_location: 'freezer' } }),
      ingredient({ id: 'sweet_potato', overrides: { storage_location: 'room_temp' } }),
      ingredient({ id: 'blueberry' }),
    ],
  },
  {
    id: 'family',
    krLabel: '가족 단위',
    enLabel: 'Family',
    description: '온 가족이 함께 식사하는 가정을 위한 패키지',
    icon: '👨‍👩‍👧‍👦',
    ingredients: [
      ingredient({ id: 'rice', overrides: { storage_location: 'room_temp' } }),
      ingredient({ id: 'egg' }),
      ingredient({ id: 'milk' }),
      ingredient({ id: 'onion', overrides: { storage_location: 'room_temp' } }),
      ingredient({ id: 'potato', overrides: { storage_location: 'room_temp' } }),
      ingredient({ id: 'carrot' }),
      ingredient({ id: 'pork', overrides: { storage_location: 'freezer' } }),
      ingredient({ id: 'chicken', overrides: { storage_location: 'freezer' } }),
      ingredient({ id: 'tofu' }),
      ingredient({ id: 'kimchi' }),
      ingredient({ id: 'green_onion' }),
      ingredient({ id: 'garlic', overrides: { storage_location: 'room_temp' } }),
    ],
  },
  {
    id: 'beginner',
    krLabel: '자취 초보',
    enLabel: 'Beginner',
    description: '처음 자취를 시작하는 분들을 위한 기본 패키지',
    icon: '🔰',
    ingredients: [
      ingredient({ id: 'ramen', overrides: { storage_location: 'room_temp' } }),
      ingredient({ id: 'instant_cooked_rice', overrides: { storage_location: 'room_temp' } }),
      ingredient({ id: 'egg' }),
      ingredient({ id: 'onion', overrides: { storage_location: 'room_temp' } }),
      ingredient({ id: 'green_onion' }),
      ingredient({ id: 'kimchi' }),
      ingredient({ id: 'milk' }),
      ingredient({ id: 'white_bread', overrides: { storage_location: 'room_temp' } }),
      ingredient({ id: 'butter' }),
      ingredient({ id: 'tuna_can', overrides: { storage_location: 'room_temp' } }),
    ],
  },
];

export function findLifestylePackageById(id: string): LifestylePackage | undefined {
  return LIFESTYLE_PACKAGES.find((pkg) => pkg.id === id);
}
