import { useState } from 'react';
import { CategoryType } from '@/constants/categories';
import { useDialog } from '@/contexts/DialogContext';

export function useAddShoppingItem() {
  const { alert } = useDialog();
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('vegetables');

  function open() {
    setIsVisible(true);
  }

  function close() {
    setIsVisible(false);
    setName('');
    setCategory('vegetables');
  }

  function handleNameChange(text: string) {
    setName(text);
  }

  function handleCategoryChange(categoryId: string) {
    setCategory(categoryId as CategoryType);
  }

  async function handleSubmit() {
    if (!name.trim()) {
      close();
      return;
    }

    try {
      const { storage } = await import('@/lib/storage');

      await storage.addToShoppingList({
        name: name.trim(),
        category,
      });

      close();

      alert({
        title: '추가 완료',
        message: `'${name.trim()}'을(를) 장보기 목록에 추가했어요.`,
        type: 'success',
      });
    } catch (error) {
      console.error('Error adding shopping item:', error);
      alert({
        title: '오류',
        message: '장보기 목록 추가 중 오류가 발생했어요.',
        type: 'error',
      });
    }
  }

  return {
    isVisible,
    name,
    category,
    open,
    close,
    handleNameChange,
    handleCategoryChange,
    handleSubmit,
  };
}
