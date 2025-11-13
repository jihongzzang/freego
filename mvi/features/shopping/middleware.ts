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

    case 'DELETE_SELECTED': {
      const selectedCount = state.selectedIds.size;

      if (selectedCount === 0) {
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '선택된 항목이 없어요.',
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
              title: '선택 항목 삭제',
              message: `${selectedCount}개의 항목을 삭제할까요?`,
              onConfirm: async () => {
                try {
                  for (const id of state.selectedIds) {
                    await shoppingService.deleteShoppingItem(id);
                  }
                  return { success: true, count: selectedCount };
                } catch (error) {
                  console.error('Error deleting selected items:', error);
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
      if (!intent.payload.name.trim()) {
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
          name: intent.payload.name.trim(),
          category: intent.payload.category,
          emoji: null,
          memo: intent.payload.memo || null,
          last_modifed_date_time: null,
          deleted_date_time: null,
        });

        const items = await shoppingService.getShoppingList();
        return {
          state: {
            ...state,
            shoppingList: items,
          },
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: `'${intent.payload.name.trim()}'을(를) 장보기 목록에 추가했어요.`,
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

    case 'DELETE_ITEM': {
      return {
        effects: [
          {
            type: 'SHOW_CONFIRM',
            payload: {
              title: '항목 삭제',
              message: `"${intent.payload.name}"을(를) 삭제할까요?`,
              onConfirm: async () => {
                try {
                  await shoppingService.deleteShoppingItem(intent.payload.id);
                  return { success: true };
                } catch (error) {
                  console.error('Error deleting item:', error);
                  return { success: false };
                }
              },
              isDanger: true,
            },
          },
        ],
      };
    }

    case 'ADD_ITEM_TO_STORAGE': {
      try {
        const { ingredientService } = await import('@/services/ingredient.service');
        const today = new Date().toISOString().split('T')[0];
        const item = state.shoppingList.find((i) => i.id === intent.payload.id);

        if (!item) {
          return {
            effects: [
              {
                type: 'SHOW_TOAST',
                payload: {
                  message: '항목을 찾을 수 없어요.',
                  variant: 'error',
                },
              },
            ],
          };
        }

        await ingredientService.addIngredient({
          name: intent.payload.name,
          category: intent.payload.category,
          emoji: item.emoji,
          storage_location: intent.payload.storageLocation as any,
          purchased_date_time: today,
          memo: null,
          last_modifed_date_time: null,
          deleted_date_time: null,
          quantity: null,
          unit: null,
          expired_date_time: null,
          consumed_date_time: null,
        });

        await shoppingService.updateShoppingItem(intent.payload.id, {
          is_purchased: true,
        });

        const items = await shoppingService.getShoppingList();

        console.log(items);

        return {
          state: {
            ...state,
            shoppingList: items,
            selectedIds: new Set<string>(),
          },
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: `${intent.payload.name}이(가) 냉장고에 추가되었어요.`,
                variant: 'success',
              },
            },
          ],
        };
      } catch (error) {
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '재고 추가 중 오류가 발생했어요.',
                variant: 'error',
              },
            },
          ],
        };
      }
    }

    case 'ADD_SELECTED_TO_STORAGE': {
      const selectedCount = state.selectedIds.size;

      if (selectedCount === 0) {
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '선택된 항목이 없어요.',
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
              title: '냉장고에 넣기',
              message: `${selectedCount}개의 항목을 냉장고에 추가할까요?`,
              onConfirm: async () => {
                try {
                  const { ingredientService } = await import('@/services/ingredient.service');
                  const today = new Date().toISOString().split('T')[0];
                  const selectedItems = state.shoppingList.filter((item) => state.selectedIds.has(item.id));

                  // 모든 선택된 항목을 냉장고에 추가하고 구매 완료 처리
                  for (const item of selectedItems) {
                    await ingredientService.addIngredient({
                      name: item.name,
                      category: item.category,
                      emoji: item.emoji,
                      storage_location: null,
                      purchased_date_time: today,
                      memo: null,
                      quantity: null,
                      unit: null,
                      expired_date_time: null,
                      last_modifed_date_time: null,
                      deleted_date_time: null,
                      consumed_date_time: null,
                    });

                    // 구매 완료로 표시
                    await shoppingService.updateShoppingItem(item.id, {
                      is_purchased: true,
                    });
                  }

                  return { success: true, count: selectedCount };
                } catch (error) {
                  console.error('Error adding selected items to storage:', error);
                  return { success: false };
                }
              },
              isDanger: false,
            },
          },
        ],
      };
    }

    case 'UPDATE_MEMO': {
      try {
        await shoppingService.updateShoppingItem(intent.payload.id, {
          memo: intent.payload.memo || null,
        });

        const items = await shoppingService.getShoppingList();
        return {
          state: {
            ...state,
            shoppingList: items,
          },
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '메모가 저장됐어요.',
                variant: 'success',
              },
            },
          ],
        };
      } catch (error) {
        console.error('Error updating memo:', error);
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '메모 저장 중 오류가 발생했어요.',
                variant: 'error',
              },
            },
          ],
        };
      }
    }

    default:
      return {};
  }
};
