import { useMemo, useState } from 'react';
import { Ingredient } from '@/mvi/features/ingredients';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import { makeCategoryList } from '@/utils/category/makeCategoryList';
import { makeStorageList } from '@/utils/category/makeStorageList';

// 미설정을 포함한 보관위치 타입
type StorageLocationOrUnset = StorageLocation | 'unset';

export function useIngredientsData(ingredients: Ingredient[]) {
  const categoryOrder: Category[] = makeCategoryList({ includeAllCategory: false }).map((cat) => cat.id);
  const storageOrder: StorageLocationOrUnset[] = [...makeStorageList().map((loc) => loc.id)];

  // 아코디언 상태 관리
  const [collapsedCategories, setCollapsedCategories] = useState<Set<Category>>(new Set(categoryOrder));
  const [collapsedStorages, setCollapsedStorages] = useState<Set<StorageLocationOrUnset>>(new Set(storageOrder));

  // 카테고리별로 재료 그룹화
  const groupedByCategory = useMemo(() => {
    const grouped: Record<Category, Ingredient[]> = {} as Record<Category, Ingredient[]>;

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
    const grouped: Record<StorageLocationOrUnset, Ingredient[]> = {} as Record<StorageLocationOrUnset, Ingredient[]>;

    ingredients.forEach((item) => {
      const location: StorageLocationOrUnset = item.storage_location || 'unset';
      if (!grouped[location]) {
        grouped[location] = [];
      }
      grouped[location].push(item);
    });

    return grouped;
  }, [ingredients]);

  // 카테고리 접기/펼치기 토글
  function toggleCategory(category: Category) {
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
  function toggleStorage(storage: StorageLocationOrUnset) {
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

  return {
    categoryOrder,
    storageOrder,
    groupedByCategory,
    groupedByStorage,
    collapsedCategories,
    collapsedStorages,
    toggleCategory,
    toggleStorage,
  };
}
