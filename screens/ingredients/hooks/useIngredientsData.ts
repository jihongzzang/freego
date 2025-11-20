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

  // 아코디언 상태 관리 - 로딩 중에는 모두 접힌 상태로 시작
  const [collapsedCategories, setCollapsedCategories] = useState<Set<Category>>(() =>
    loading ? new Set(categoryOrder) : new Set()
  );
  const [collapsedStorages, setCollapsedStorages] = useState<Set<StorageLocationOrUnset>>(() =>
    loading ? new Set(storageOrder) : new Set()
  );
  const hasInitializedRef = useRef(false);

  // 재료 데이터가 로드되면 초기 상태 설정 (한 번만)
  useEffect(() => {
    console.log('🔵 useEffect 실행됨');
    console.log('hasInitializedRef.current:', hasInitializedRef.current);
    console.log('loading:', loading);
    console.log('ingredients.length:', ingredients.length);

    // 로딩이 완료되고 아직 초기화되지 않았을 때만 초기화
    if (!hasInitializedRef.current && !loading) {
      console.log('🟢 초기화 시작');

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
        console.log(`카테고리 ${cat}: ${grouped[cat]?.length || 0}개 - ${hasItems ? '펼침' : '접힘'}`);
        if (!hasItems) {
          collapsedCats.add(cat);
        }
      });

      const collapsedStrs = new Set<StorageLocationOrUnset>();
      storageOrder.forEach((storage) => {
        const hasItems = groupedStorage[storage] && groupedStorage[storage].length > 0;
        console.log(`보관위치 ${storage}: ${groupedStorage[storage]?.length || 0}개 - ${hasItems ? '펼침' : '접힘'}`);
        if (!hasItems) {
          collapsedStrs.add(storage);
        }
      });

      console.log('접힌 카테고리:', Array.from(collapsedCats));
      console.log('접힌 보관위치:', Array.from(collapsedStrs));

      setCollapsedCategories(collapsedCats);
      setCollapsedStorages(collapsedStrs);
      hasInitializedRef.current = true;
      console.log('🟢 초기화 완료');
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
