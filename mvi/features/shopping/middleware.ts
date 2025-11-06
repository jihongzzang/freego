/**
 * Shopping List Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { ShoppingState, ShoppingIntent, ShoppingEffect } from './types';
import { storage } from '@/lib/storage';

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
        const items = await storage.getShoppingList();
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
        };
      }
    }

    case 'TOGGLE_PURCHASED': {
      try {
        await storage.updateShoppingItem(intent.payload.id, {
          is_purchased: !intent.payload.currentStatus,
        });

        // 다시 로드
        const items = await storage.getShoppingList();
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
              type: 'SHOW_ALERT',
              payload: {
                title: '오류',
                message: '상태 변경에 실패했어요.',
                variant: 'error',
              },
            },
          ],
        };
      }
    }

    case 'DELETE_ITEM': {
      return {
        effects: [
          {
            type: 'SHOW_CONFIRM',
            payload: {
              // title: '삭제 확인',
              message: `"${intent.payload.name}"을(를) 장보기 목록에서 삭제할까요?`,
              onConfirm: async () => {
                try {
                  await storage.deleteShoppingItem(intent.payload.id);
                  // 삭제 후 목록 새로고침을 위한 LOAD_SHOPPING_LIST intent 발행은
                  // 컴포넌트에서 처리하도록 함
                } catch (error) {
                  console.error('Error deleting shopping item:', error);
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
              type: 'SHOW_ALERT',
              payload: {
                title: '입력 오류',
                message: '재료 이름을 입력해주세요.',
                variant: 'warning',
              },
            },
          ],
        };
      }

      try {
        await storage.addToShoppingList({
          name: state.addForm.name.trim(),
          category: state.addForm.category,
        });

        const items = await storage.getShoppingList();
        return {
          state: {
            ...state,
            shoppingList: items,
            isAddingItem: false,
            addForm: { name: '', category: 'vegetables' },
          },
          effects: [
            {
              type: 'SHOW_ALERT',
              payload: {
                title: '완료',
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
              type: 'SHOW_ALERT',
              payload: {
                title: '오류',
                message: '항목 추가에 실패했어요.',
                variant: 'error',
              },
            },
          ],
        };
      }
    }

    case 'CLEAR_PURCHASED': {
      const purchasedItems = state.shoppingList.filter((item) => item.is_purchased);

      if (purchasedItems.length === 0) {
        return {
          effects: [
            {
              type: 'SHOW_ALERT',
              payload: {
                title: '알림',
                message: '구매한 항목이 없어요.',
                variant: 'info',
              },
            },
          ],
        };
      }

      return {
        effects: [
          {
            type: 'SHOW_CONFIRM',
            payload: {
              title: '구매 완료 항목 삭제',
              message: `${purchasedItems.length}개의 구매 완료 항목을 삭제할까요?`,
              onConfirm: async () => {
                try {
                  for (const item of purchasedItems) {
                    await storage.deleteShoppingItem(item.id);
                  }
                  // 삭제 후 목록 새로고침은 컴포넌트에서 처리
                } catch (error) {
                  console.error('Error clearing purchased items:', error);
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
