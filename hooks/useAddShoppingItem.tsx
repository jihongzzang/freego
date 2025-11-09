import { useState } from 'react';
import { Category } from '@/data/enums/category';
import { useDialog } from '@/contexts/DialogContext';

interface UseAddShoppingItemProps {
  onSuccess?: () => void;
}

export function useAddShoppingItem(props?: UseAddShoppingItemProps) {
  const { alert } = useDialog();
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(Category.VEGETABLE);
  const [memo, setMemo] = useState('');

  function open() {
    setIsVisible(true);
  }

  function close() {
    setIsVisible(false);
    setName('');
    setCategory(Category.VEGETABLE);
    setMemo('');
  }

  function handleNameChange(text: string) {
    setName(text);
  }

  function handleCategoryChange(categoryId: number) {
    setCategory(categoryId as Category);
  }

  function handleMemoChange(text: string) {
    setMemo(text);
  }

  async function handleSubmit() {
    if (!name.trim()) {
      close();
      return;
    }

    try {
      const { shoppingService } = await import('@/services/shopping.service');

      await shoppingService.addToShoppingList({
        name: name.trim(),
        category,
        memo: memo.trim() || undefined,
      });

      close();

      // 성공 콜백 호출 (목록 새로고침)
      if (props?.onSuccess) {
        props.onSuccess();
      }

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
    memo,
    open,
    close,
    handleNameChange,
    handleCategoryChange,
    handleMemoChange,
    handleSubmit,
  };
}
