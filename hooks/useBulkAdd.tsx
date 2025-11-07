import { useState } from 'react';
import { ALL_CATEGORY, AllCategoryType, CategoryType } from '@/constants/categories';
import { type IngredientTemplate } from '@/constants/ingredientTemplates';
import { StorageLocationType } from '@/constants/storageLocations';
import { UnitType } from '@/constants/units';
import { useDialog } from '@/contexts/DialogContext';

export function useBulkAdd(onSuccess?: () => void) {
  const { alert } = useDialog();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<AllCategoryType>(ALL_CATEGORY.id);
  const [selectedTemplates, setSelectedTemplates] = useState<IngredientTemplate[]>([]);

  function open() {
    setIsVisible(true);
  }

  function close() {
    setIsVisible(false);
    setSelectedTemplates([]);
    setSelectedCategoryId(ALL_CATEGORY.id);
  }

  function handleCategoryChange(categoryId: AllCategoryType) {
    setSelectedCategoryId(categoryId);
  }

  function handleTemplateToggle(template: IngredientTemplate) {
    setSelectedTemplates((prev) => {
      const isSelected = prev.some((t) => t.id === template.id);
      if (isSelected) {
        return prev.filter((t) => t.id !== template.id);
      } else {
        return [...prev, template];
      }
    });
  }

  function handleRegisterReceipt() {
    alert({
      title: '준비중이에요',
      message: '빠른 시일내에 업데이트 할게요.',
      type: 'info',
    });
  }

  async function handleConfirm() {
    if (selectedTemplates.length === 0) {
      close();
      return;
    }

    try {
      const { storage } = await import('@/lib/storage');
      const ingredientsToAdd = selectedTemplates.map((template) => ({
        name: template.krLabel,
        category: template.category as CategoryType,
        emoji: template.emoji,
        storage_location: undefined,
        quantity: undefined,
        unit: template.defaultUnit as UnitType,
        registration_date: new Date().toISOString().split('T')[0],
        purchase_date: undefined,
        expiry_date: undefined,
        memo: '',
      }));

      await storage.addMultipleIngredients(ingredientsToAdd);

      close();

      alert({
        title: '추가 완료',
        message: `${selectedTemplates.length}개의 재료가 추가됐어요.`,
        type: 'success',
      });

      // 성공 콜백 실행
      onSuccess?.();
    } catch (error) {
      console.error('Error adding templates:', error);
      alert({
        title: '오류',
        message: '재료 추가 중 오류가 발생했어요.',
        type: 'error',
      });
    }
  }

  return {
    isVisible,
    selectedCategoryId,
    selectedTemplates,
    open,
    close,
    handleCategoryChange,
    handleTemplateToggle,
    handleConfirm,
    handleRegisterReceipt,
  };
}
