/**
 * Shopping List Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { ShoppingState, ShoppingIntent, ShoppingEffect } from './types';
import { shoppingService } from '@/services/shopping.service';

/**
 * Shopping Middleware
 */
export const shoppingMiddleware: Middleware<ShoppingState, ShoppingIntent, ShoppingEffect> = async (
  state,
  intent,
): Promise<MiddlewareResult<ShoppingState, ShoppingEffect>> => {
  switch (intent.type) {
    case 'LOAD_SHOPPING_LIST': {
      try {
        const items = await shoppingService.getShoppingList();
        return {
          state: {
            ...state,
            shoppingList: items,
            loading: false,
            error: null,
          },
        };
      } catch (error) {
        console.error('Error fetching shopping list:', error);
        return {
          state: {
            ...state,
            loading: false,
            error: error instanceof Error ? error.message : '데이터 로드 실패',
          },
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '장보기 목록을 불러오는데 실패했어요.',
                variant: 'error',
              },
            },
          ],
        };
      }
    }

    case 'TOGGLE_PURCHASED': {
      try {
        await shoppingService.updateShoppingItem(Number(intent.payload.id), {
          is_purchased: !intent.payload.currentStatus,
        });

        // 다시 로드
        const items = await shoppingService.getShoppingList();
        return {
          state: {
            ...state,
            shoppingList: items,
          },
        };
      } catch (error) {
        console.error('Error toggling purchased status:', error);
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '상태 변경에 실패했어요.',
                variant: 'error',
              },
            },
          ],
        };
      }
    }

    case 'DELETE_ITEM': {
      const itemName = intent.payload.name;
      return {
        effects: [
          {
            type: 'SHOW_CONFIRM',
            payload: {
              title: '장보기 목록 삭제',
              message: `"${itemName}"을(를) 장보기 목록에서 삭제할까요?`,
              onConfirm: async () => {
                try {
                  await shoppingService.deleteShoppingItem(Number(intent.payload.id));
                  return { success: true };
                } catch (error) {
                  console.error('Error deleting shopping item:', error);
                  return { success: false };
                }
              },
              isDanger: true,
            },
          },
        ],
      };
    }

    case 'SUBMIT_ADD_ITEM': {
      if (!state.addForm.name.trim()) {
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '재료 이름을 입력해주세요.',
                variant: 'warning',
              },
            },
          ],
        };
      }

      try {
        await shoppingService.addToShoppingList({
          name: state.addForm.name.trim(),
          category: state.addForm.category,
        });

        const items = await shoppingService.getShoppingList();
        return {
          state: {
            ...state,
            shoppingList: items,
            isAddingItem: false,
            addForm: { name: '', category: 1 },
          },
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '장보기 목록에 추가됐어요.',
                variant: 'success',
              },
            },
          ],
        };
      } catch (error) {
        console.error('Error adding shopping item:', error);
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '항목 추가에 실패했어요.',
                variant: 'error',
              },
            },
          ],
        };
      }
    }

    case 'CLEAR_UNPURCHASED': {
      const unpurchasedItems = state.shoppingList.filter((item) => !item.is_purchased);

      if (unpurchasedItems.length === 0) {
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '구매 예정 항목이 없어요.',
                variant: 'info',
              },
            },
          ],
        };
      }

      const itemCount = unpurchasedItems.length;
      return {
        effects: [
          {
            type: 'SHOW_CONFIRM',
            payload: {
              title: '구매 예정 항목 삭제',
              message: `${itemCount}개의 구매 예정 항목을 삭제할까요?`,
              onConfirm: async () => {
                try {
                  for (const item of unpurchasedItems) {
                    await shoppingService.deleteShoppingItem(item.id);
                  }
                  return { success: true, count: itemCount };
                } catch (error) {
                  console.error('Error clearing unpurchased items:', error);
                  return { success: false };
                }
              },
              isDanger: true,
            },
          },
        ],
      };
    }

    default:
      return {};
  }
};
