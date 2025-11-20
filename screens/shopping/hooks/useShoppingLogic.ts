import { useEffect, useCallback, useState } from 'react';
import { Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect } from 'expo-router';
import { useDialog } from '@/contexts/DialogContext';
import { useToast } from '@/components/ui';
import { useMVIStore } from '@/mvi/base';
import { createShoppingStore } from '@/mvi/features/shopping';
import { StorageLocation } from '@/data/enums/storage_location';
import { Category } from '@/data/enums/category';
import { getCategoryLabel } from '@/utils/category/getCategoryLabel';
import ERROR_MESSAGES from '@/constants/toast/errorMessages';
import SUCCESS_MESSAGES from '@/constants/toast/successMessages';
import { getRandomEmojiForCategory } from '@/constants/ingredientTemplates';

export function useShoppingLogic() {
  const { confirm } = useDialog();
  const { showToast } = useToast();
  const [state, dispatch, effect] = useMVIStore(createShoppingStore);

  // Add Shopping Item State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [addItemName, setAddItemName] = useState('');
  const [addItemCategory, setAddItemCategory] = useState<Category>(Category.VEGETABLE);
  const [addItemMemo, setAddItemMemo] = useState('');

  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [editingMemo, setEditingMemo] = useState('');
  const [selectingStorageForItem, setSelectingStorageForItem] = useState<{
    id: string;
    name: string;
    category: Category;
  } | null>(null);

  // Emoji Update State
  const [editingEmojiId, setEditingEmojiId] = useState<string | null>(null);

  // Name Update State
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

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
            console.log('🟠 SHOW_CONFIRM onConfirm started');
            const result = await effect.payload.onConfirm();
            console.log('🟠 SHOW_CONFIRM result:', result);

            // 선택 상태 먼저 초기화
            console.log('🟠 Dispatching CLEAR_SELECTION');
            dispatch({ type: 'CLEAR_SELECTION' });

            // 데이터 다시 로드
            console.log('🟠 Dispatching LOAD_SHOPPING_LIST');
            dispatch({ type: 'LOAD_SHOPPING_LIST' });

            // 결과에 따라 토스트 표시
            if (result && result.success) {
              // actionType으로 명확하게 구분
              switch (effect.payload.actionType) {
                case 'add_to_storage':
                  showToast({
                    message: `${result.count}개 항목이 냉장고에 추가됐어요.`,
                    type: 'success',
                  });
                  break;
                case 'delete':
                  showToast({
                    message: SUCCESS_MESSAGES.SUCCESS_DELETE_SHOPPING_LIST_ITEM,
                    type: 'success',
                  });
                  break;
                case 'cancel_purchase':
                  showToast({
                    message: '구매완료가 취소되었어요.',
                    type: 'success',
                  });
                  break;
                default:
                  // actionType이 없는 경우 기본 성공 메시지
                  showToast({
                    message: SUCCESS_MESSAGES.SUCCESS_DELETE_SHOPPING_LIST_ITEM,
                    type: 'success',
                  });
              }
            } else if (result && result.success === false) {
              // actionType으로 에러 메시지도 구분
              switch (effect.payload.actionType) {
                case 'add_to_storage':
                  showToast({
                    message: ERROR_MESSAGES.ERROR_INGREDIENT_CREATE_ERROR,
                    type: 'error',
                  });
                  break;
                case 'delete':
                  showToast({
                    message: ERROR_MESSAGES.ERROR_SHOPPING_ITEM_DELETE_FAILED,
                    type: 'error',
                  });
                  break;
                case 'cancel_purchase':
                  showToast({
                    message: '구매완료 취소에 실패했어요.',
                    type: 'error',
                  });
                  break;
                default:
                  showToast({
                    message: ERROR_MESSAGES.ERROR_SHOPPING_ITEM_DELETE_FAILED,
                    type: 'error',
                  });
              }
            }
          },
          onCancel: undefined,
          confirmText: effect.payload.isDanger ? '삭제' : '확인',
          cancelText: '취소',
          isDestructive: effect.payload.isDanger,
        });
        break;
    }
  }, [effect, showToast, confirm, dispatch]);

  function handleToggleSelect(id: string) {
    dispatch({ type: 'TOGGLE_SELECT', payload: { id } });
  }

  function handleToggleSelectAll() {
    dispatch({ type: 'TOGGLE_SELECT_ALL' });
  }

  function handleDeleteSelected() {
    dispatch({ type: 'DELETE_SELECTED' });
  }

  function handleAddSelectedToStorage() {
    dispatch({ type: 'ADD_SELECTED_TO_STORAGE' });
  }

  function handleDeleteItem(id: string, name: string) {
    dispatch({ type: 'DELETE_ITEM', payload: { id, name } });
  }

  function handleAddToStorage(id: string, name: string, category: Category) {
    setSelectingStorageForItem({ id, name, category });
  }

  function handleStorageSelect(storageLocation: StorageLocation) {
    if (!selectingStorageForItem) return;

    dispatch({
      type: 'ADD_ITEM_TO_STORAGE',
      payload: {
        id: selectingStorageForItem.id,
        name: selectingStorageForItem.name,
        category: selectingStorageForItem.category,
        storageLocation: storageLocation as any,
      },
    });

    setSelectingStorageForItem(null);
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
      const categoryLabel = getCategoryLabel({ category: categoryId as Category, lang: 'kr' });

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
        } catch (clipboardError) {
          showToast({
            message: ERROR_MESSAGES.ERROR_SHARING_FAILED,
            type: 'error',
          });
        }
      }
    }, 300);
  }

  function handleMemoPress(id: string, currentMemo: string | null) {
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

  function handleMemoSubmit() {
    if (!editingMemoId) return;

    dispatch({
      type: 'UPDATE_MEMO',
      payload: {
        id: editingMemoId,
        memo: editingMemo,
      },
    });

    handleMemoClose();
  }

  // Emoji Update Handlers
  function handleEmojiPress(id: string) {
    setEditingEmojiId(id);
  }

  function handleEmojiClose() {
    setEditingEmojiId(null);
  }

  function handleEmojiSubmit(emoji: string) {
    if (!editingEmojiId) return;

    dispatch({
      type: 'UPDATE_EMOJI',
      payload: {
        id: editingEmojiId,
        emoji,
      },
    });

    handleEmojiClose();
  }

  // Name Update Handlers
  function handleNamePress(id: string, currentName: string) {
    setEditingNameId(id);
    setEditingName(currentName);
  }

  function handleNameClose() {
    setEditingNameId(null);
    setEditingName('');
  }

  function handleNameChange(text: string) {
    setEditingName(text);
  }

  function handleNameSubmit() {
    if (!editingNameId) return;

    dispatch({
      type: 'UPDATE_NAME',
      payload: {
        id: editingNameId,
        name: editingName,
      },
    });

    handleNameClose();
  }

  // Cancel Purchase Handler
  function handleCancelPurchase(id: string, name: string) {
    dispatch({
      type: 'CANCEL_PURCHASE',
      payload: {
        id,
        name,
      },
    });
  }

  // Repurchase Handler
  function handleRepurchase(id: string, name: string) {
    dispatch({
      type: 'REPURCHASE',
      payload: {
        id,
        name,
      },
    });
  }

  // Delete Date Items Handler
  function handleDeleteDateItems(dateKey: string, itemIds: string[]) {
    dispatch({
      type: 'DELETE_DATE_ITEMS',
      payload: {
        dateKey,
        itemIds,
      },
    });
  }

  // Add Shopping Item Handlers
  function handleOpenAddItem() {
    setIsAddingItem(true);
  }

  function handleCloseAddItem() {
    setIsAddingItem(false);
    setAddItemName('');
    setAddItemCategory(Category.VEGETABLE);
    setAddItemMemo('');
  }

  function handleAddItemNameChange(text: string) {
    setAddItemName(text);
  }

  function handleAddItemCategoryChange(categoryId: Category) {
    setAddItemCategory(categoryId);
  }

  function handleAddItemMemoChange(text: string) {
    setAddItemMemo(text);
  }

  function handleAddItemSubmit() {
    if (!addItemName.trim()) {
      handleCloseAddItem();
      return;
    }

    dispatch({
      type: 'SUBMIT_ADD_ITEM',
      payload: {
        name: addItemName.trim(),
        category: addItemCategory,
        memo: addItemMemo.trim() || undefined,
        emoji: getRandomEmojiForCategory(addItemCategory),
      },
    });

    handleCloseAddItem();
  }

  return {
    state,
    dispatch,
    addShoppingItem: {
      isVisible: isAddingItem,
      name: addItemName,
      category: addItemCategory,
      memo: addItemMemo,
      open: handleOpenAddItem,
      close: handleCloseAddItem,
      handleNameChange: handleAddItemNameChange,
      handleCategoryChange: handleAddItemCategoryChange,
      handleMemoChange: handleAddItemMemoChange,
      handleSubmit: handleAddItemSubmit,
    },
    handleToggleSelect,
    handleToggleSelectAll,
    handleDeleteSelected,
    handleDeleteItem,
    handleAddSelectedToStorage,
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
    handleEmojiPress,
    editingEmojiId,
    handleEmojiClose,
    handleEmojiSubmit,
    handleNamePress,
    editingNameId,
    editingName,
    handleNameClose,
    handleNameChange,
    handleNameSubmit,
    handleCancelPurchase,
    handleRepurchase,
    handleDeleteDateItems,
  };
}
