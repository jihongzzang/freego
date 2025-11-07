import { useMemo, useState } from 'react';
import { Ingredient } from '@/mvi/features/ingredients';
import { CATEGORIES, CategoryType } from '@/constants/categories';
import { STORAGE_LOCATIONS, StorageLocationType } from '@/constants/storageLocations';

export function useIngredientsData(ingredients: Ingredient[]) {
  const categoryOrder: CategoryType[] = CATEGORIES.map((cat) => cat.id);
  const storageOrder: StorageLocationType[] = STORAGE_LOCATIONS.map((loc) => loc.id);

  // 아코디언 상태 관리
  const [collapsedCategories, setCollapsedCategories] = useState<Set<CategoryType>>(new Set(categoryOrder));
  const [collapsedStorages, setCollapsedStorages] = useState<Set<StorageLocationType>>(new Set(storageOrder));

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

  // 저장위치별로 재료 그룹화
  const groupedByStorage = useMemo(() => {
    const grouped: Record<StorageLocationType, Ingredient[]> = {} as Record<StorageLocationType, Ingredient[]>;

    ingredients.forEach((item) => {
      if (!grouped[item.storage_location]) {
        grouped[item.storage_location] = [];
      }
      grouped[item.storage_location].push(item);
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

  // 저장위치 접기/펼치기 토글
  function toggleStorage(storage: StorageLocationType) {
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
