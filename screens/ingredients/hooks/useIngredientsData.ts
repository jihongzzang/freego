import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { Ingredient } from '@/mvi/features/ingredients';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import { makeCategoryList } from '@/utils/category/makeCategoryList';
import { makeStorageList } from '@/utils/category/makeStorageList';

// 미설정을 포함한 보관위치 타입
type StorageLocationOrUnset = StorageLocation | 'unset';

export function useIngredientsData(ingredients: Ingredient[], loading: boolean = false) {
  const categoryOrder: Category[] = makeCategoryList({ includeAllCategory: false }).map((cat) => cat.id);
  const storageOrder: StorageLocationOrUnset[] = [...makeStorageList().map((loc) => loc.id)];

  // 카테고리별로 재료 그룹화 및 유통기한 순 정렬
  const groupedByCategory = useMemo(() => {
    const grouped: Record<Category, Ingredient[]> = {} as Record<Category, Ingredient[]>;

    ingredients.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    // 각 카테고리 내에서 3단계 우선순위로 정렬
    Object.keys(grouped).forEach((category) => {
      grouped[category as Category].sort((a, b) => {
        const hasExpiredA = !!a.expired_date_time;
        const hasExpiredB = !!b.expired_date_time;

        // 1순위: 유통기한이 있는 재료 (오름차순 - 임박한 것이 먼저)
        if (hasExpiredA && hasExpiredB) {
          return new Date(a.expired_date_time!).getTime() - new Date(b.expired_date_time!).getTime();
        }
        if (hasExpiredA && !hasExpiredB) return -1;
        if (!hasExpiredA && hasExpiredB) return 1;

        // 2순위: 유통기한 없고 수정된 재료 (수정일 내림차순 - 최근 수정이 먼저)
        const hasModifiedA = !!a.last_modified_date_time;
        const hasModifiedB = !!b.last_modified_date_time;

        if (hasModifiedA && hasModifiedB) {
          return new Date(b.last_modified_date_time!).getTime() - new Date(a.last_modified_date_time!).getTime();
        }
        if (hasModifiedA && !hasModifiedB) return -1;
        if (!hasModifiedA && hasModifiedB) return 1;

        // 3순위: 수정되지 않은 재료 (생성일 내림차순 - 최근 생성이 먼저)
        return new Date(b.created_date_time!).getTime() - new Date(a.created_date_time!).getTime();
      });
    });

    return grouped;
  }, [ingredients]);

  // 보관위치별로 재료 그룹화 및 유통기한 순 정렬
  const groupedByStorage = useMemo(() => {
    const grouped: Record<StorageLocationOrUnset, Ingredient[]> = {} as Record<StorageLocationOrUnset, Ingredient[]>;

    ingredients.forEach((item) => {
      const location: StorageLocationOrUnset = item.storage_location || 'unset';
      if (!grouped[location]) {
        grouped[location] = [];
      }
      grouped[location].push(item);
    });

    // 각 보관위치 내에서 3단계 우선순위로 정렬
    Object.keys(grouped).forEach((storage) => {
      grouped[storage as StorageLocationOrUnset].sort((a, b) => {
        const hasExpiredA = !!a.expired_date_time;
        const hasExpiredB = !!b.expired_date_time;

        // 1순위: 유통기한이 있는 재료 (오름차순 - 임박한 것이 먼저)
        if (hasExpiredA && hasExpiredB) {
          return new Date(a.expired_date_time!).getTime() - new Date(b.expired_date_time!).getTime();
        }
        if (hasExpiredA && !hasExpiredB) return -1;
        if (!hasExpiredA && hasExpiredB) return 1;

        // 2순위: 유통기한 없고 수정된 재료 (수정일 내림차순 - 최근 수정이 먼저)
        const hasModifiedA = !!a.last_modified_date_time;
        const hasModifiedB = !!b.last_modified_date_time;

        if (hasModifiedA && hasModifiedB) {
          return new Date(b.last_modified_date_time!).getTime() - new Date(a.last_modified_date_time!).getTime();
        }
        if (hasModifiedA && !hasModifiedB) return -1;
        if (!hasModifiedA && hasModifiedB) return 1;

        // 3순위: 수정되지 않은 재료 (생성일 내림차순 - 최근 생성이 먼저)
        return new Date(b.created_date_time!).getTime() - new Date(a.created_date_time!).getTime();
      });
    });

    return grouped;
  }, [ingredients]);

  // 아코디언 상태 관리 - 로딩 중에는 모두 접힌 상태로 시작
  const [collapsedCategories, setCollapsedCategories] = useState<Set<Category>>(() =>
    loading ? new Set(categoryOrder) : new Set(),
  );
  const [collapsedStorages, setCollapsedStorages] = useState<Set<StorageLocationOrUnset>>(() =>
    loading ? new Set(storageOrder) : new Set(),
  );
  const hasInitializedRef = useRef(false);

  // 재료 데이터가 로드되면 초기 상태 설정 (한 번만)
  useEffect(() => {
    // 로딩이 완료되고 아직 초기화되지 않았을 때만 초기화
    if (!hasInitializedRef.current && !loading) {
      // 현재 재료를 기반으로 그룹화
      const grouped: Record<string, Ingredient[]> = {};
      ingredients.forEach((item) => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
      });

      const groupedStorage: Record<string, Ingredient[]> = {};
      ingredients.forEach((item) => {
        const location = item.storage_location || 'unset';
        if (!groupedStorage[location]) groupedStorage[location] = [];
        groupedStorage[location].push(item);
      });

      const collapsedCats = new Set<Category>();
      categoryOrder.forEach((cat) => {
        const hasItems = grouped[cat] && grouped[cat].length > 0;
        if (!hasItems) {
          collapsedCats.add(cat);
        }
      });

      const collapsedStrs = new Set<StorageLocationOrUnset>();
      storageOrder.forEach((storage) => {
        const hasItems = groupedStorage[storage] && groupedStorage[storage].length > 0;
        if (!hasItems) {
          collapsedStrs.add(storage);
        }
      });

      setCollapsedCategories(collapsedCats);
      setCollapsedStorages(collapsedStrs);
      hasInitializedRef.current = true;
    }
  }, [loading, ingredients]);

  // 카테고리 접기/펼치기 토글 (메모이제이션)
  const toggleCategory = useCallback((category: Category) => {
    setCollapsedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }, []);

  // 보관위치 접기/펼치기 토글 (메모이제이션)
  const toggleStorage = useCallback((storage: StorageLocationOrUnset) => {
    setCollapsedStorages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(storage)) {
        newSet.delete(storage);
      } else {
        newSet.add(storage);
      }
      return newSet;
    });
  }, []);

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
