import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from '@/hooks/useRouter';
import { useToast } from '@/components/ui';
import { useMVIStore } from '@/mvi/base';
import { createAddStore } from '@/mvi/features/add';
import type { AddFormData } from '@/mvi/features/add';
import { useUnitPicker } from '@/hooks/useUnitPicker';
import { useExpiryDatePicker } from '@/hooks/useExpiryDatePicker';
import { usePurchaseDatePicker } from '@/hooks/usePurchateDatePicker';
import { type IngredientTemplate } from '@/constants/ingredientTemplates';

export function useAddLogic() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { showToast } = useToast();
  const [state, dispatch, effect] = useMVIStore(createAddStore);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<IngredientTemplate | null>(null);

  const handleFieldChange = (field: keyof AddFormData, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
  };

  const unitPicker = useUnitPicker({
    onUnitChange: (unitId) => handleFieldChange('unit', unitId),
  });

  const expiryDatePicker = useExpiryDatePicker({
    onDateConfirm: (formattedDate) => handleFieldChange('expiry_date', formattedDate),
  });

  const purchaseDatePicker = usePurchaseDatePicker({
    onDateConfirm: (formattedDate) => handleFieldChange('purchased_date', formattedDate),
  });

  // 키보드 이벤트 리스너
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Effect 처리
  useEffect(() => {
    if (!effect) return;

    switch (effect.type) {
      case 'SHOW_TOAST':
        showToast({
          message: effect.payload.message,
          type: effect.payload.variant,
        });
        break;

      case 'NAVIGATE_HOME':
        router.push('/(tabs)');
        break;

      case 'NAVIGATE_BACK':
        router.back();
        break;
    }
  }, [effect, showToast, router]);

  // URL 파라미터로 전달된 카테고리를 초기값으로 설정
  useEffect(() => {
    if (category) {
      handleFieldChange('category', category);
    }
  }, [category]);

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

  const handleSubmit = () => {
    dispatch({ type: 'SUBMIT_FORM' });
  };

  const handleBackPress = () => {
    dispatch({ type: 'NAVIGATE_BACK' });
  };

  return {
    state,
    isKeyboardVisible,
    isEmojiPickerVisible,
    setIsEmojiPickerVisible,
    selectedEmoji,
    unitPicker,
    expiryDatePicker,
    purchaseDatePicker,
    handleFieldChange,
    handleQuickSelect,
    handleEmojiSelect,
    handleSubmit,
    handleBackPress,
  };
}
