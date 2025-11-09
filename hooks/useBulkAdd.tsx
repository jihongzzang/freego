import { useState } from 'react';
import { Category } from '@/data/enums/category';
import { type IngredientTemplate } from '@/constants/ingredientTemplates';
import { Unit } from '@/data/enums/unit';
import { useToast } from '@/components/ui';

export function useBulkAdd(onSuccess?: () => void) {
  const { showToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<Category | 0>(0);
  const [selectedTemplates, setSelectedTemplates] = useState<IngredientTemplate[]>([]);

  function open() {
    setIsVisible(true);
  }

  function close() {
    setIsVisible(false);
    setSelectedTemplates([]);
    setSelectedCategoryId(0);
  }

  function handleCategoryChange(categoryId: Category | 0) {
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

  async function handleConfirm() {
    if (selectedTemplates.length === 0) {
      close();
      return;
    }

    try {
      const { ingredientService } = await import('@/services/ingredient.service');
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

      await ingredientService.addMultipleIngredients(ingredientsToAdd);

      close();

      showToast({
        message: `${selectedTemplates.length}개의 재료가 추가됐어요.`,
        type: 'success',
      });

      // 성공 콜백 실행
      onSuccess?.();
    } catch (error) {
      console.error('Error adding templates:', error);
      showToast({
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
  };
}
