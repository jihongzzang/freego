import { useMemo } from 'react';
import { Ingredient } from '@/mvi/features/home';
import { ALL_CATEGORIES, ALL_CATEGORY, AllCategoryType } from '@/constants/categories';
import { StatusType } from '@/constants/itemStatus';

export function useHomeData(ingredients: Ingredient[], selectedCategoryId: AllCategoryType) {
  // 만료된 재료 필터링
  const expiringItems = useMemo(() => {
    return ingredients.filter((item) => item.status === 'expired');
  }, [ingredients]);

  // 선택된 카테고리 정보
  const selectedCategoryItem = useMemo(
    () => ALL_CATEGORIES.find((cat) => cat.id === selectedCategoryId),
    [selectedCategoryId],
  );

  // 선택된 카테고리에 따른 재료 필터링
  const filteredIngredients = useMemo(() => {
    if (selectedCategoryId === ALL_CATEGORY.id) {
      return ingredients;
    }
    return ingredients.filter((item) => item.category === selectedCategoryId);
  }, [ingredients, selectedCategoryId]);

  // 카테고리별 개수 계산
  const getCategoryCount = (categoryId: AllCategoryType) => {
    if (categoryId === ALL_CATEGORY.id) {
      return ingredients.length;
    }
    return ingredients.filter((item) => item.category === categoryId).length;
  };

  // 유통기한 표시 텍스트
  function getExpiryDisplay(status: StatusType, daysRemaining: number | null): string {
    if (status === 'not_set') return '유통기한 입력필요';

    if (daysRemaining === null) return '';

    if (daysRemaining < 0) {
      return `소비기한 지남 (D+${Math.abs(daysRemaining)})`;
    }
    return `D-${daysRemaining} 남음`;
  }

  return {
    expiringItems,
    selectedCategoryItem,
    filteredIngredients,
    getCategoryCount,
    getExpiryDisplay,
  };
}
