import { useMemo, useState } from 'react';
import { Ingredient } from '@/mvi/features/ingredients';
import { CATEGORIES, CategoryType } from '@/constants/categories';
import { STORAGE_LOCATIONS, StorageLocationType } from '@/constants/storageLocations';

// 미설정을 포함한 보관위치 타입
type StorageLocationTypeOrUnset = StorageLocationType | 'unset';

export function useIngredientsData(ingredients: Ingredient[]) {
  const categoryOrder: CategoryType[] = CATEGORIES.map((cat) => cat.id);
  const storageOrder: StorageLocationTypeOrUnset[] = [...STORAGE_LOCATIONS.map((loc) => loc.id), 'unset'];

  // 아코디언 상태 관리
  const [collapsedCategories, setCollapsedCategories] = useState<Set<CategoryType>>(new Set(categoryOrder));
  const [collapsedStorages, setCollapsedStorages] = useState<Set<StorageLocationTypeOrUnset>>(new Set(storageOrder));

  // 카테고리별로 재료 그룹화
  const groupedByCategory = useMemo(() => {
    const grouped: Record<CategoryType, Ingredient[]> = {} as Record<CategoryType, Ingredient[]>;

    ingredients.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  }, [ingredients]);

  // 보관위치별로 재료 그룹화
  const groupedByStorage = useMemo(() => {
    const grouped: Record<StorageLocationTypeOrUnset, Ingredient[]> = {} as Record<StorageLocationTypeOrUnset, Ingredient[]>;

    ingredients.forEach((item) => {
      const location: StorageLocationTypeOrUnset = item.storage_location || 'unset';
      if (!grouped[location]) {
        grouped[location] = [];
      }
      grouped[location].push(item);
    });

    return grouped;
  }, [ingredients]);

  // 카테고리 접기/펼치기 토글
  function toggleCategory(category: CategoryType) {
    setCollapsedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }

  // 보관위치 접기/펼치기 토글
  function toggleStorage(storage: StorageLocationTypeOrUnset) {
    setCollapsedStorages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(storage)) {
        newSet.delete(storage);
      } else {
        newSet.add(storage);
      }
      return newSet;
    });
  }

  function getDaysRemaining(daysRemaining: number | null): string {
    if (daysRemaining === null) return '';

    if (daysRemaining < 0) return '만료됨';
    if (daysRemaining === 0) return '오늘';
    if (daysRemaining === 1) return '내일';
    return `${daysRemaining}일 남음`;
  }

  return {
    categoryOrder,
    storageOrder,
    groupedByCategory,
    groupedByStorage,
    collapsedCategories,
    collapsedStorages,
    toggleCategory,
    toggleStorage,
    getDaysRemaining,
  };
}
