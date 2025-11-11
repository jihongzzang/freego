import { useEffect, useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useRouter } from '@/hooks/useRouter';
import { useToast } from '@/components/ui';
import { useMVIStore } from '@/mvi/base';
import { createIngredientsStore } from '@/mvi/features/ingredients';
import { type IngredientTemplate } from '@/constants/ingredientTemplates';
import { Category } from '@/data/enums/category';
import { Unit } from '@/data/enums/unit';

export type ViewMode = 'category' | 'storage';

export function useIngredientsLogic() {
  const router = useRouter();
  const { showToast } = useToast();
  const [state, dispatch, effect] = useMVIStore(createIngredientsStore);
  const { ingredients, loading } = state;

  // 뷰 모드 상태
  const [viewMode, setViewMode] = useState<ViewMode>('category');

  // 스크롤 애니메이션
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  // BulkAdd 로컬 상태
  const [isBulkAddVisible, setIsBulkAddVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<Category | 0>(0);
  const [selectedTemplates, setSelectedTemplates] = useState<IngredientTemplate[]>([]);

  // Effect 처리
  useEffect(() => {
    if (effect) {
      switch (effect.type) {
        case 'NAVIGATE':
          if (effect.payload === 'back') {
            router.back();
          } else {
            router.push(effect.payload as any);
          }
          break;
        case 'SHOW_TOAST':
          showToast({
            message: effect.payload.message,
            type: effect.payload.variant,
          });
          break;
      }
    }
  }, [effect, router, showToast]);

  // 화면 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      dispatch({ type: 'LOAD_INGREDIENTS' });
    }, [dispatch]),
  );

  function handleNavigateToDetail(id: string) {
    dispatch({ type: 'NAVIGATE_TO_DETAIL', payload: Number(id) });
  }

  function handleNavigateToEdit(id: string) {
    dispatch({ type: 'NAVIGATE_TO_DETAIL_EDIT', payload: Number(id) });
  }

  function handleNavigateToAdd() {
    dispatch({ type: 'NAVIGATE_TO_ADD' });
  }

  function handleQuickDelete(id: string) {
    dispatch({ type: 'DELETE_INGREDIENT', payload: Number(id) });
  }

  function handleQuickAdd(id: string) {
    dispatch({ type: 'ADD_TO_SHOPPING_LIST_INGREDIENT', payload: Number(id) });
  }

  // BulkAdd 핸들러
  function handleBulkAddOpen() {
    setIsBulkAddVisible(true);
  }

  function handleBulkAddClose() {
    setIsBulkAddVisible(false);
    setSelectedTemplates([]);
    setSelectedCategoryId(0);
  }

  function handleBulkAddCategoryChange(categoryId: Category | 0) {
    setSelectedCategoryId(categoryId);
  }

  function handleBulkAddTemplateToggle(template: IngredientTemplate) {
    setSelectedTemplates((prev) => {
      const isSelected = prev.some((t) => t.id === template.id);
      if (isSelected) {
        return prev.filter((t) => t.id !== template.id);
      } else {
        return [...prev, template];
      }
    });
  }

  function handleBulkAddConfirm() {
    if (selectedTemplates.length === 0) {
      handleBulkAddClose();
      return;
    }

    const ingredientsToAdd = selectedTemplates.map((template) => ({
      name: template.krLabel,
      category: template.category as Category,
      emoji: template.emoji,
      storage_location: undefined,
      quantity: undefined,
      unit: template.defaultUnit as Unit,
      registration_date: new Date().toISOString().split('T')[0],
      purchase_date: undefined,
      expiry_date: undefined,
      memo: '',
    }));

    dispatch({
      type: 'BULK_ADD_INGREDIENTS',
      payload: ingredientsToAdd,
    });

    handleBulkAddClose();
  }

  return {
    ingredients,
    loading,
    viewMode,
    setViewMode,
    scrollY,
    scrollViewRef,
    bulkAdd: {
      isVisible: isBulkAddVisible,
      selectedCategoryId,
      selectedTemplates,
      open: handleBulkAddOpen,
      close: handleBulkAddClose,
      handleCategoryChange: handleBulkAddCategoryChange,
      handleTemplateToggle: handleBulkAddTemplateToggle,
      handleConfirm: handleBulkAddConfirm,
    },
    handleNavigateToDetail,
    handleNavigateToEdit,
    handleNavigateToAdd,
    handleQuickDelete,
    handleQuickAdd,
  };
}
