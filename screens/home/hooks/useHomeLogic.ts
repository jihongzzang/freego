import { useEffect, useCallback, useState, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { Animated } from 'react-native';
import { useMVIStore } from '@/mvi/base';
import { createHomeStore, Ingredient } from '@/mvi/features/home';
import { useRouter } from '@/hooks/useRouter';
import { useExpiryDatePicker } from '@/hooks/useExpiryDatePicker';
import { type IngredientTemplate } from '@/constants/ingredientTemplates';
import { Category } from '@/data/enums/category';
import { Unit } from '@/data/enums/unit';
import { useToast } from '@/components/ui';

export function useHomeLogic() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { showToast } = useToast();

  // 선택된 카테고리 상태
  const [selectedCategoryId, setSelectedCategoryId] = useState<Category | 0>(0);

  // 유통기한 수정 모달 상태
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  // BulkAdd 로컬 상태
  const [isBulkAddVisible, setIsBulkAddVisible] = useState(false);
  const [bulkAddCategoryId, setBulkAddCategoryId] = useState<Category | 0>(0);
  const [selectedTemplates, setSelectedTemplates] = useState<IngredientTemplate[]>([]);

  // MVI Store
  const [state, dispatch, effect] = useMVIStore(createHomeStore);

  // 유통기한 업데이트 함수
  const updateExpiryDate = (expiryDate: string) => {
    if (!selectedIngredient) return;
    dispatch({
      type: 'UPDATE_EXPIRY_DATE',
      payload: { id: Number(selectedIngredient.id), expiryDate },
    });
  };

  // 유통기한 선택 훅
  const expiryDatePicker = useExpiryDatePicker({
    onDateConfirm: updateExpiryDate,
  });

  // Effect 처리
  useEffect(() => {
    if (effect) {
      switch (effect.type) {
        case 'NAVIGATE':
          router.push(effect.payload as any);
          break;
        case 'SHOW_TOAST':
          showToast({
            message: effect.payload.message,
            type: effect.payload.variant,
          });
          break;
      }
    }
  }, [effect, router]);

  // 화면 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      dispatch({ type: 'LOAD_INGREDIENTS' });
    }, [dispatch]),
  );

  // 유통기한 수정 모달 열기
  function openDatePicker(item: Ingredient) {
    setSelectedIngredient(item);
    expiryDatePicker.open(item.expiry_date || new Date());
  }

  function navigateIngredientDetail(ingredientId: number) {
    dispatch({ type: 'NAVIGATE_TO_DETAIL', payload: ingredientId });
  }

  // BulkAdd 핸들러
  function handleBulkAddOpen() {
    setIsBulkAddVisible(true);
  }

  function handleBulkAddClose() {
    setIsBulkAddVisible(false);
    setSelectedTemplates([]);
    setBulkAddCategoryId(0);
  }

  function handleBulkAddCategoryChange(categoryId: Category | 0) {
    setBulkAddCategoryId(categoryId);
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

  // 플로팅 버튼 메뉴 아이템
  const getFloatingMenuItems = () => [
    {
      icon: 'Edit3',
      label: '직접 재료 등록',
      onPress: () => {
        dispatch({
          type: 'NAVIGATE_TO_ADD',
          payload: selectedCategoryId === 0 ? undefined : (selectedCategoryId as number),
        });
      },
    },
    {
      icon: 'Grid3x3',
      label: '한꺼번에 재료 등록',
      onPress: handleBulkAddOpen,
    },
  ];

  return {
    state,
    dispatch,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedIngredient,
    scrollY,
    openDatePicker,
    getFloatingMenuItems,
    expiryDatePicker,
    bulkAdd: {
      isVisible: isBulkAddVisible,
      selectedCategoryId: bulkAddCategoryId,
      selectedTemplates,
      open: handleBulkAddOpen,
      close: handleBulkAddClose,
      handleCategoryChange: handleBulkAddCategoryChange,
      handleTemplateToggle: handleBulkAddTemplateToggle,
      handleConfirm: handleBulkAddConfirm,
    },
    navigateIngredientDetail,
  };
}
