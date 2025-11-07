import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from '@/hooks/useRouter';
import { useDialog } from '@/contexts/DialogContext';
import { useMVIStore } from '@/mvi/base';
import { createIngredientDetailStore, EditFormData } from '@/mvi/features/ingredient-detail';
import { useUnitPicker } from '@/hooks/useUnitPicker';
import { useExpiryDatePicker } from '@/hooks/useExpiryDatePicker';
import { type IngredientTemplate } from '@/constants/ingredientTemplates';

export function useIngredientDetailLogic() {
  const router = useRouter();
  const { id, mode } = useLocalSearchParams();
  const { alert, confirm } = useDialog();
  const [state, dispatch, effect] = useMVIStore(createIngredientDetailStore);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<IngredientTemplate | null>(null);

  const handleFieldChange = (field: keyof EditFormData, value: string) => {
    dispatch({ type: 'UPDATE_FORM_FIELD', payload: { field, value } });
  };

  const unitPicker = useUnitPicker({
    onUnitChange: (unitId) => handleFieldChange('unit', unitId),
  });

  const expiryDatePicker = useExpiryDatePicker({
    onDateConfirm: (formattedDate) => handleFieldChange('expiry_date', formattedDate),
  });

  const purchaseDatePicker = useExpiryDatePicker({
    onDateConfirm: (formattedDate) => handleFieldChange('purchase_date', formattedDate),
  });

  // 식재료 데이터 로드
  useEffect(() => {
    if (id) {
      dispatch({ type: 'LOAD_INGREDIENT', payload: id as string });
    }
  }, [id, dispatch]);

  // mode=edit 쿼리 파라미터가 있으면 편집 모드 활성화
  useEffect(() => {
    if (mode === 'edit' && state.ingredient) {
      dispatch({ type: 'SET_EDITING', payload: true });
    }
  }, [mode, state.ingredient, dispatch]);

  // 재료가 로드되면 이모지 상태 초기화
  useEffect(() => {
    if (state.ingredient?.emoji && state.editForm.emoji) {
      const { getTemplatesByCategory } = require('@/constants/ingredientTemplates');
      const templates = getTemplatesByCategory(state.ingredient.category);
      const matchedTemplate = templates.find((t: IngredientTemplate) => t.emoji === state.editForm.emoji);
      if (matchedTemplate) {
        setSelectedEmoji(matchedTemplate);
      }
    }
  }, [state.ingredient, state.editForm.emoji]);

  // Effect 처리
  useEffect(() => {
    if (!effect) return;

    switch (effect.type) {
      case 'SHOW_ALERT':
        alert({
          title: effect.payload.title,
          message: effect.payload.message,
          type: effect.payload.variant,
        });
        break;

      case 'SHOW_CONFIRM':
        confirm({
          title: effect.payload.title,
          message: effect.payload.message,
          onConfirm: async () => {
            await effect.payload.onConfirm();
            if (effect.payload.title?.includes('삭제')) {
              dispatch({ type: 'DELETE_SUCCESS' });
            } else if (effect.payload.title?.includes('소모')) {
              dispatch({
                type: 'CONSUME_SUCCESS',
                payload: { name: state.ingredient?.name || '' },
              });
            }
          },
          onCancel: undefined,
          confirmText: effect.payload.isDanger ? '삭제' : '소모',
          cancelText: '취소',
          isDestructive: effect.payload.isDanger,
        });
        break;

      case 'NAVIGATE_BACK':
        router.back();
        break;
    }
  }, [effect, alert, confirm, router, state.ingredient, dispatch]);

  // Android 시스템 백버튼 핸들링
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (state.isEditing) {
        dispatch({ type: 'SET_EDITING', payload: false });
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [state.isEditing, dispatch]);

  const handleDelete = () => {
    dispatch({ type: 'DELETE_INGREDIENT' });
  };

  const handleConsume = () => {
    dispatch({ type: 'CONSUME_INGREDIENT' });
  };

  const handleUpdate = () => {
    dispatch({ type: 'UPDATE_INGREDIENT' });
  };

  const handleQuickSelect = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    handleFieldChange('expiry_date', formattedDate);
  };

  const handleEmojiSelect = (template: IngredientTemplate) => {
    setSelectedEmoji(template);
    handleFieldChange('emoji', template.emoji);
    setIsEmojiPickerVisible(false);
  };

  const handleBackPress = () => {
    if (state.isEditing) {
      dispatch({ type: 'SET_EDITING', payload: false });
    } else {
      dispatch({ type: 'NAVIGATE_BACK' });
    }
  };

  const handleToggleEdit = () => {
    dispatch({ type: 'SET_EDITING', payload: !state.isEditing });
  };

  return {
    state,
    dispatch,
    unitPicker,
    expiryDatePicker,
    purchaseDatePicker,
    isEmojiPickerVisible,
    setIsEmojiPickerVisible,
    selectedEmoji,
    handleFieldChange,
    handleDelete,
    handleConsume,
    handleUpdate,
    handleQuickSelect,
    handleEmojiSelect,
    handleBackPress,
    handleToggleEdit,
  };
}
