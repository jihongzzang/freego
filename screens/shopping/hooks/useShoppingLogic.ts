import { useEffect, useCallback, useState } from 'react';
import { Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect } from 'expo-router';
import { useDialog } from '@/contexts/DialogContext';
import { useToast } from '@/components/ui';
import { useMVIStore } from '@/mvi/base';
import { createShoppingStore } from '@/mvi/features/shopping';
import { useAddShoppingItem } from '@/hooks/useAddShoppingItem';
import { StorageLocation } from '@/data/enums/storage_location';
import { Category } from '@/data/enums/category';
import { getCategoryLabel } from '@/utils/category/getCategoryLabel';

export function useShoppingLogic() {
  const { alert, confirm } = useDialog();
  const { showToast } = useToast();
  const [state, dispatch, effect] = useMVIStore(createShoppingStore);
  const addShoppingItem = useAddShoppingItem({
    onSuccess: () => {
      dispatch({ type: 'LOAD_SHOPPING_LIST' });
    },
  });
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [editingMemo, setEditingMemo] = useState('');
  const [selectingStorageForItem, setSelectingStorageForItem] = useState<{
    id: string;
    name: string;
    category: number;
  } | null>(null);

  // 화면 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      dispatch({ type: 'LOAD_SHOPPING_LIST' });
    }, [dispatch]),
  );

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
      case 'SHOW_CONFIRM':
        confirm({
          title: effect.payload.title,
          message: effect.payload.message,
          onConfirm: async () => {
            await effect.payload.onConfirm();
            dispatch({ type: 'LOAD_SHOPPING_LIST' });
          },
          onCancel: undefined,
          confirmText: '삭제',
          cancelText: '취소',
          isDestructive: effect.payload.isDanger,
        });
        break;
    }
  }, [effect, showToast, confirm, dispatch]);

  function handleTogglePurchased(id: string, currentStatus: boolean) {
    dispatch({ type: 'TOGGLE_PURCHASED', payload: { id, currentStatus } });
  }

  function handleDeleteItem(id: string, name: string) {
    dispatch({ type: 'DELETE_ITEM', payload: { id, name } });
  }

  function handleClearPurchased() {
    dispatch({ type: 'CLEAR_PURCHASED' });
  }

  function handleClearUnpurchased() {
    dispatch({ type: 'CLEAR_UNPURCHASED' });
  }

  async function handleAddAllToStorage() {
    const purchasedItems = state.shoppingList.filter((item) => item.is_purchased);

    if (purchasedItems.length === 0) {
      return;
    }

    try {
      const { ingredientService } = await import('@/services/ingredient.service');
      const { shoppingService } = await import('@/services/shopping.service');

      // 모든 구매 완료 항목을 storage_location: undefined로 재고에 추가
      const today = new Date().toISOString().split('T')[0];
      for (const item of purchasedItems) {
        await ingredientService.addIngredient({
          name: item.name,
          category: item.category,
          storage_location: undefined,
          purchased_date: today,
          memo: '',
        });
        await shoppingService.deleteShoppingItem(Number(item.id));
      }

      dispatch({ type: 'LOAD_SHOPPING_LIST' });

      showToast({
        message: `${purchasedItems.length}개 품목이 재고에 추가되었어요.`,
        type: 'success',
      });
    } catch (error) {
      console.error('Error adding to storage:', error);
      showToast({
        message: '재고 추가 중 오류가 발생했어요.',
        type: 'error',
      });
    }
  }

  function handleAddToStorage(id: string, name: string, category: number) {
    setSelectingStorageForItem({ id, name, category });
  }

  async function handleStorageSelect(storageLocation: StorageLocation) {
    if (!selectingStorageForItem) return;

    try {
      const { ingredientService } = await import('@/services/ingredient.service');
      const { shoppingService } = await import('@/services/shopping.service');
      const today = new Date().toISOString().split('T')[0];

      await ingredientService.addIngredient({
        name: selectingStorageForItem.name,
        category: selectingStorageForItem.category as any,
        storage_location: storageLocation as any,
        purchased_date: today,
        memo: '',
      });

      await shoppingService.deleteShoppingItem(Number(selectingStorageForItem.id));

      dispatch({ type: 'LOAD_SHOPPING_LIST' });

      showToast({
        message: `${selectingStorageForItem.name}이(가) 재고에 추가되었어요.`,
        type: 'success',
      });

      setSelectingStorageForItem(null);
    } catch (error) {
      console.error('Error adding to storage:', error);
      showToast({
        message: '재고 추가 중 오류가 발생했어요.',
        type: 'error',
      });
    }
  }

  function handleShare() {
    const unpurchasedItems = state.shoppingList.filter((item) => !item.is_purchased);

    if (unpurchasedItems.length === 0) {
      showToast({
        message: '공유할 구매 예정 항목이 없어요.',
        type: 'info',
      });
      return;
    }

    // 카테고리별로 그룹화
    const groupedItems: Record<string, typeof unpurchasedItems> = {};
    unpurchasedItems.forEach((item) => {
      if (!groupedItems[item.category]) {
        groupedItems[item.category] = [];
      }
      groupedItems[item.category].push(item);
    });

    // 공유 텍스트 생성
    let shareText = '📝 장보기 목록\n\n';

    Object.keys(groupedItems).forEach((categoryId) => {
      const items = groupedItems[categoryId];
      const categoryLabel = getCategoryLabel({ category: Number(categoryId) as Category, lang: 'kr' });

      shareText += `${categoryLabel}\n`;
      items.forEach((item) => {
        shareText += `• ${item.name}`;
        if (item.memo) {
          shareText += ` (${item.memo})`;
        }
        shareText += '\n';
      });
      shareText += '\n';
    });

    // setTimeout을 사용해서 메뉴가 닫힌 후에 Share dialog 표시
    setTimeout(async () => {
      try {
        await Share.share({
          message: shareText,
        });
      } catch (error) {
        try {
          await Clipboard.setStringAsync(shareText);
          showToast({
            message: '장보기 목록이 클립보드에 복사되었어요.',
            type: 'success',
          });
        } catch (clipboardError) {
          showToast({
            message: '공유 중 오류가 발생했어요.',
            type: 'error',
          });
        }
      }
    }, 300);
  }

  function handleMemoPress(id: string, currentMemo?: string) {
    setEditingMemoId(id);
    setEditingMemo(currentMemo || '');
  }

  function handleMemoClose() {
    setEditingMemoId(null);
    setEditingMemo('');
  }

  function handleMemoChange(text: string) {
    setEditingMemo(text);
  }

  async function handleMemoSubmit() {
    if (!editingMemoId) return;

    try {
      const { shoppingService } = await import('@/services/shopping.service');
      await shoppingService.updateShoppingItem(Number(editingMemoId), {
        memo: editingMemo.trim() || undefined,
      });

      dispatch({ type: 'LOAD_SHOPPING_LIST' });
      handleMemoClose();

      showToast({
        message: '메모가 저장됐어요.',
        type: 'success',
      });
    } catch (error) {
      console.error('Error updating memo:', error);
      showToast({
        message: '메모 저장 중 오류가 발생했어요.',
        type: 'error',
      });
    }
  }

  return {
    state,
    addShoppingItem,
    handleTogglePurchased,
    handleDeleteItem,
    handleClearUnpurchased,
    handleAddAllToStorage,
    handleAddToStorage,
    handleStorageSelect,
    selectingStorageForItem,
    setSelectingStorageForItem,
    handleShare,
    handleMemoPress,
    editingMemoId,
    editingMemo,
    handleMemoClose,
    handleMemoChange,
    handleMemoSubmit,
  };
}
