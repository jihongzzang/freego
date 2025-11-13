import { useEffect, useState, useRef } from 'react';
import { BackHandler } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from '@/hooks/useRouter';
import { useDialog } from '@/contexts/DialogContext';
import { useToast } from '@/components/ui';
import { useMVIStore } from '@/mvi/base';
import { createIngredientDetailStore, EditFormData } from '@/mvi/features/ingredient-detail';
import { useUnitPicker } from '@/hooks/useUnitPicker';
import { useExpiryDatePicker } from '@/hooks/useExpiryDatePicker';

export function useIngredientDetailLogic() {
  const router = useRouter();
  const { id, mode } = useLocalSearchParams();
  const { confirm } = useDialog();
  const { showToast } = useToast();
  const [state, dispatch, effect] = useMVIStore(createIngredientDetailStore);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const processedEffectRef = useRef<typeof effect>(null);

  const handleFieldChange = (field: keyof EditFormData, value: any) => {
    dispatch({ type: 'UPDATE_FORM_FIELD', payload: { field, value } });
  };

  const unitPicker = useUnitPicker({
    onUnitChange: (unitId) => handleFieldChange('unit', unitId),
  });

  const expiryDatePicker = useExpiryDatePicker({
    onDateConfirm: (date) => handleFieldChange('expired_date_time', date),
  });

  const purchaseDatePicker = useExpiryDatePicker({
    onDateConfirm: (date) => handleFieldChange('purchased_date_time', date),
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
    if (state.ingredient?.emoji) {
      setSelectedEmoji(state.ingredient.emoji);
    }
  }, [state.ingredient?.emoji]);

  // Effect 처리
  useEffect(() => {
    if (!effect) return;

    // 이미 처리한 effect는 다시 처리하지 않음
    if (processedEffectRef.current === effect) return;
    processedEffectRef.current = effect;

    switch (effect.type) {
      case 'SHOW_TOAST':
        showToast({
          message: effect.payload.message,
          type: effect.payload.variant,
        });
        break;

      case 'SHOW_CONFIRM':
        confirm({
          title: effect.payload.title,
          message: effect.payload.message,
          onConfirm: async () => {
            const result = await effect.payload.onConfirm();

            // 삭제 성공
            if (effect.payload.isDanger && result && result.success) {
              dispatch({ type: 'DELETE_SUCCESS' });
            }
            // 소모 성공
            else if (!effect.payload.isDanger && result && result.success && result.ingredientName) {
              dispatch({
                type: 'CONSUME_SUCCESS',
                payload: { name: result.ingredientName },
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
  }, [effect, confirm, showToast, router, dispatch]);

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
    const formattedDate = date.toISOString();
    handleFieldChange('expired_date_time', formattedDate);
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    handleFieldChange('emoji', emoji);
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
