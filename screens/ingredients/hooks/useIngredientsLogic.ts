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
import { StorageLocation } from '@/data/enums/storage_location';
import ERROR_MESSAGES from '@/constants/toast/errorMessages';

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
  const [selectedCategoryId, setSelectedCategoryId] = useState<Category | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<IngredientTemplate[]>([]);

  // QuickUpdateEmoji 로컬 상태
  const [isEmojiUpdateVisible, setIsEmojiUpdateVisible] = useState(false);
  const [selectedEmojiIngredientId, setSelectedEmojiIngredientId] = useState<string | null>(null);

  // QuickUpdateQuantity 로컬 상태
  const [isQuantityUpdateVisible, setIsQuantityUpdateVisible] = useState(false);
  const [selectedQuantityIngredientId, setSelectedQuantityIngredientId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string>('');

  // QuickUpdateStorge 로컬 상태
  const [isStorageUpdateVisible, setIsStorageUpdateVisible] = useState(false);
  const [selectedStorageIngredientId, setSelectedStorageIngredientId] = useState<string | null>(null);

  // QuickUpdateExpiry 로컬 상태
  const [isExpiryUpdateVisible, setIsExpiryUpdateVisible] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date>(new Date());

  // QuickUpdateMemo 로컬 상태
  const [isMemoUpdateVisible, setIsMemoUpdateVisible] = useState(false);
  const [selectedMemoIngredientId, setSelectedMemoIngredientId] = useState<string | null>(null);
  const [memo, setMemo] = useState<string>('');

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
    dispatch({ type: 'NAVIGATE_TO_DETAIL', payload: id });
  }

  function handleNavigateToEdit(id: string) {
    dispatch({ type: 'NAVIGATE_TO_DETAIL_EDIT', payload: id });
  }

  function handleNavigateToAdd() {
    dispatch({ type: 'NAVIGATE_TO_ADD' });
  }

  function handleQuickDelete(id: string) {
    dispatch({ type: 'DELETE_INGREDIENT', payload: id });
  }

  function handleQuickAdd(id: string) {
    dispatch({ type: 'ADD_TO_SHOPPING_LIST_INGREDIENT', payload: id });
  }

  // QuickUpdateExpiry 핸들러
  function handleQuickUpdateExpiryOpen(id: string) {
    const ingredient = ingredients.find((ing) => ing.id === id);
    if (ingredient) {
      setSelectedIngredientId(id);
      setExpiryDate(ingredient.expired_date_time ? new Date(ingredient.expired_date_time) : new Date());
      setIsExpiryUpdateVisible(true);
    }
  }

  function handleQuickUpdateExpiryClose() {
    setIsExpiryUpdateVisible(false);
    setSelectedIngredientId(null);
  }

  function handleExpiryDateChange(date: Date) {
    setExpiryDate(date);
  }

  function handleExpiryDateConfirm() {
    if (selectedIngredientId !== null) {
      dispatch({
        type: 'UPDATE_INGREDIENT_EXPIRY',
        payload: {
          id: selectedIngredientId,
          expired_date_time: expiryDate.toISOString(),
        },
      });
      handleQuickUpdateExpiryClose();
    }
  }

  // QuickUpdateEmoji 핸들러
  function handleQuickUpdateEmojiOpen(id: string) {
    const ingredient = ingredients.find((ing) => ing.id === id);
    if (ingredient) {
      setSelectedEmojiIngredientId(id);
      setIsEmojiUpdateVisible(true);
    }
  }

  function handleQuickUpdateEmojiClose() {
    setIsEmojiUpdateVisible(false);
    setSelectedEmojiIngredientId(null);
  }

  function handleEmojiSelect(emoji: string) {
    if (selectedEmojiIngredientId !== null) {
      dispatch({
        type: 'UPDATE_INGREDIENT_EMOJI',
        payload: {
          id: selectedEmojiIngredientId,
          emoji: emoji,
        },
      });
      handleQuickUpdateEmojiClose();
    }
  }

  // QuickUpdateQuantity 핸들러
  function handleQuickUpdateQuantityOpen(id: string) {
    const ingredient = ingredients.find((ing) => ing.id === id);
    if (ingredient) {
      setSelectedQuantityIngredientId(id);
      setQuantity(String(ingredient.quantity || ''));
      setIsQuantityUpdateVisible(true);
    }
  }

  function handleQuickUpdateQuantityClose() {
    setIsQuantityUpdateVisible(false);
    setSelectedQuantityIngredientId(null);
    setQuantity('');
  }

  function handleQuantityChange(quantity: string) {
    setQuantity(quantity);
  }

  function handleQuantityConfirm() {
    if (selectedQuantityIngredientId !== null) {
      // 수량 검증 (선택적 - 안 쓰거나 양수만)
      if (quantity) {
        const trimmedQuantity = quantity.trim();

        // 빈 문자열이 아닌 경우에만 검증
        if (trimmedQuantity !== '') {
          // 숫자가 아닌 경우
          if (isNaN(Number(trimmedQuantity))) {
            showToast({
              message: ERROR_MESSAGES.ERROR_INVALID_INGREDIENT_QUANTITY,
              type: 'error',
            });
            return;
          }
          // 0 이하인 경우 (0 포함, 음수 포함)
          else if (Number(trimmedQuantity) <= 0) {
            showToast({
              message: ERROR_MESSAGES.ERROR_INGREDIENT_QUANTITY_MUST_BE_GREATER_THAN_ZERO,
              type: 'error',
            });
            return;
          }
        }
      }

      dispatch({
        type: 'UPDATE_INGREDIENT_QUANTITY',
        payload: {
          id: selectedQuantityIngredientId,
          quantity: quantity,
        },
      });
      handleQuickUpdateQuantityClose();
    }
  }

  // StorageUpdate 핸들러
  function handleQuickUpdateStorageOpen(id: string) {
    const ingredient = ingredients.find((ing) => ing.id === id);
    if (ingredient) {
      setSelectedStorageIngredientId(id);
      setIsStorageUpdateVisible(true);
    }
  }

  function handleQuickUpdateStorageClose() {
    setIsStorageUpdateVisible(false);
    setSelectedStorageIngredientId(null);
  }

  function handleStorageSelect(storageLocation: StorageLocation) {
    if (selectedStorageIngredientId !== null) {
      dispatch({
        type: 'UPDATE_INGREDIENT_STORAGE',
        payload: {
          id: selectedStorageIngredientId,
          storage_location: storageLocation,
        },
      });
      handleQuickUpdateStorageClose();
    }
  }

  // MemoUpdate 핸들러
  function handleQuickUpdateMemoOpen(id: string) {
    const ingredient = ingredients.find((ing) => ing.id === id);
    if (ingredient) {
      setSelectedMemoIngredientId(id);
      setMemo(ingredient.memo || '');
      setIsMemoUpdateVisible(true);
    }
  }

  function handleQuickUpdateMemoClose() {
    setIsMemoUpdateVisible(false);
    setSelectedMemoIngredientId(null);
    setMemo('');
  }

  function handleMemoChange(memo: string) {
    setMemo(memo);
  }

  function handleMemoConfirm() {
    if (selectedMemoIngredientId !== null) {
      dispatch({
        type: 'UPDATE_MEMO',
        payload: {
          id: selectedMemoIngredientId,
          memo: memo ? memo : null,
        },
      });
      handleQuickUpdateMemoClose();
    }
  }

  // BulkAdd 핸들러
  function handleBulkAddOpen() {
    setIsBulkAddVisible(true);
  }

  function handleBulkAddClose() {
    setIsBulkAddVisible(false);
    setSelectedTemplates([]);
    setSelectedCategoryId(null);
  }

  function handleBulkAddCategoryChange(categoryId: Category | null) {
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
      storage_location: null,
      quantity: null,
      unit: template.defaultUnit as Unit,
      memo: null,
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
    emojiUpdate: {
      isVisible: isEmojiUpdateVisible,
      open: handleQuickUpdateEmojiOpen,
      close: handleQuickUpdateEmojiClose,
      handleSelect: handleEmojiSelect,
    },
    quantityUpdate: {
      isVisible: isQuantityUpdateVisible,
      quantity,
      open: handleQuickUpdateQuantityOpen,
      close: handleQuickUpdateQuantityClose,
      handleQuantityChange,
      handleConfirm: handleQuantityConfirm,
    },
    storageUpdate: {
      isVisible: isStorageUpdateVisible,
      open: handleQuickUpdateStorageOpen,
      close: handleQuickUpdateStorageClose,
      handleSelect: handleStorageSelect,
    },
    expiryUpdate: {
      isVisible: isExpiryUpdateVisible,
      expiryDate,
      open: handleQuickUpdateExpiryOpen,
      close: handleQuickUpdateExpiryClose,
      handleDateChange: handleExpiryDateChange,
      handleConfirm: handleExpiryDateConfirm,
    },
    memoUpdate: {
      isVisible: isMemoUpdateVisible,
      memo,
      open: handleQuickUpdateMemoOpen,
      close: handleQuickUpdateMemoClose,
      handleMemoChange,
      handleConfirm: handleMemoConfirm,
    },
    handleNavigateToDetail,
    handleNavigateToEdit,
    handleNavigateToAdd,
    handleQuickDelete,
    handleQuickAdd,
  };
}
