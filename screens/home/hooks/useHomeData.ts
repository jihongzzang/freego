import { useMemo } from 'react';
import { Ingredient } from '@/mvi/features/home';
import { Category } from '@/data/enums/category';
import { StatusType } from '@/data/enums/status';
import { makeCategoryList } from '@/utils/category/makeCategoryList';

export function useHomeData(ingredients: Ingredient[], selectedCategoryId: Category | null) {
  // 만료된 재료 필터링
  const expiringItems = useMemo(() => {
    return ingredients.filter((item) => item.status === 'expired');
  }, [ingredients]);

  // 선택된 카테고리 정보
  const categories = useMemo(() => makeCategoryList({ includeAllCategory: true, lang: 'kr' }), []);
  const selectedCategoryItem = useMemo(
    () => categories.find((cat) => cat.id === selectedCategoryId),
    [selectedCategoryId, categories],
  );

  // 선택된 카테고리에 따른 재료 필터링
  const filteredIngredients = useMemo(() => {
    if (selectedCategoryId === null || selectedCategoryId === Category.ALL) {
      return ingredients;
    }
    return ingredients.filter((item) => item.category === selectedCategoryId);
  }, [ingredients, selectedCategoryId]);

  // 카테고리별 개수 계산
  const getCategoryCount = (categoryId: Category | null) => {
    if (categoryId === null || categoryId === Category.ALL) {
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
