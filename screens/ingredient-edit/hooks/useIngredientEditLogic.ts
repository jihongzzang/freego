import { useEffect, useState, useRef } from 'react';
import { BackHandler } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from '@/hooks/useRouter';
import { useToast } from '@/components/ui';
import { useMVIStore } from '@/mvi/base';
import { createIngredientEditStore, EditFormData } from '@/mvi/features/ingredient-edit';
import { useUnitPicker } from '@/hooks/useUnitPicker';
import { useExpiryDatePicker } from '@/hooks/useExpiryDatePicker';

export function useIngredientEditLogic() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { showToast } = useToast();
  const [state, dispatch, effect] = useMVIStore(createIngredientEditStore);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
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

  // 식재료 데이터 로드 및 편집 모드 자동 활성화
  useEffect(() => {
    if (id) {
      dispatch({ type: 'LOAD_INGREDIENT', payload: id as string });
    }
  }, [id, dispatch]);

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

      case 'NAVIGATE_BACK':
        router.back();
        break;
    }
  }, [effect, showToast, router, dispatch]);

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
    handleFieldChange('emoji', emoji);
    setIsEmojiPickerVisible(false);
  };

  const handleBackPress = () => {
    router.back();
  };

  return {
    state,
    dispatch,
    unitPicker,
    expiryDatePicker,
    purchaseDatePicker,
    isEmojiPickerVisible,
    setIsEmojiPickerVisible,
    handleFieldChange,
    handleUpdate,
    handleQuickSelect,
    handleEmojiSelect,
    handleBackPress,
  };
}
