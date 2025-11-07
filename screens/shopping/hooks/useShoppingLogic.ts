import { useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useDialog } from '@/contexts/DialogContext';
import { useMVIStore } from '@/mvi/base';
import { createShoppingStore } from '@/mvi/features/shopping';
import { useAddShoppingItem } from '@/hooks/useAddShoppingItem';

export function useShoppingLogic() {
  const { alert, confirm } = useDialog();
  const [state, dispatch, effect] = useMVIStore(createShoppingStore);
  const addShoppingItem = useAddShoppingItem();

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
            dispatch({ type: 'LOAD_SHOPPING_LIST' });
          },
          onCancel: undefined,
          confirmText: '삭제',
          cancelText: '취소',
          isDestructive: effect.payload.isDanger,
        });
        break;
    }
  }, [effect, alert, confirm, dispatch]);

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

  return {
    state,
    addShoppingItem,
    handleTogglePurchased,
    handleDeleteItem,
    handleClearPurchased,
    handleClearUnpurchased,
  };
}
