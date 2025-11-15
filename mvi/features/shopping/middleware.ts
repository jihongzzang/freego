/**
 * Shopping List Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { ShoppingState, ShoppingIntent, ShoppingEffect } from './types';
import { shoppingService } from '@/services/shopping.service';
import { createErrorEffect, createInfoEffect, createSuccessEffect, createWarningEffect } from '@/mvi/shared';
import ERROR_MESSAGES from '@/constants/toast/errorMessages';
import SUCCESS_MESSAGES from '@/constants/toast/successMessages';

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
        console.log('🟡 LOAD_SHOPPING_LIST (middleware):', {
          currentSelectedIds: state.selectedIds.size,
        });
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
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_SHOPPING_LIST_LOAD_FAILED)],
        };
      }
    }

    case 'DELETE_SELECTED': {
      const selectedCount = state.selectedIds.size;

      if (selectedCount === 0) {
        return {
          effects: [createWarningEffect('선택된 항목이 없어요.')],
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
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_MISSING_INGREDIENT_NAME)],
        };
      }

      try {
        await shoppingService.addToShoppingList({
          name: intent.payload.name.trim(),
          category: intent.payload.category,
          emoji: intent.payload.emoji,
          memo: intent.payload.memo || null,
          last_modified_date_time: null,
          deleted_date_time: null,
        });

        const items = await shoppingService.getShoppingList();
        return {
          state: {
            ...state,
            shoppingList: items,
          },
          effects: [createSuccessEffect(`'${intent.payload.name.trim()}'을(를) 장보기 목록에 추가했어요.`)],
        };
      } catch (error) {
        console.error('Error adding shopping item:', error);
        return {
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_SHOPPING_ITEM_ADD_FAILED)],
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
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const todayIso = todayMidnight.toISOString();
        const item = state.shoppingList.find((i) => i.id === intent.payload.id);

        if (!item) {
          return {
            effects: [createErrorEffect(ERROR_MESSAGES.ERROR_INGREDIENT_ITEM_NOT_FOUND)],
          };
        }

        await ingredientService.addIngredient({
          name: intent.payload.name,
          category: intent.payload.category,
          emoji: item.emoji,
          storage_location: intent.payload.storageLocation,
          purchased_date_time: todayIso,
          memo: null,
          last_modified_date_time: null,
          deleted_date_time: null,
          quantity: null,
          unit: null,
          expired_date_time: null,
          consumed_date_time: null,
        });

        await shoppingService.updateShoppingItem(intent.payload.id, {
          is_purchased: true,
          purchased_date_time: todayMidnight.toISOString(),
        });

        const items = await shoppingService.getShoppingList();

        return {
          state: {
            ...state,
            shoppingList: items,
          },
          effects: [createSuccessEffect(`${intent.payload.name}이(가) 냉장고에 추가되었어요.`)],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_INGREDIENT_CREATE_ERROR)],
        };
      }
    }

    case 'ADD_SELECTED_TO_STORAGE': {
      const selectedCount = state.selectedIds.size;

      if (selectedCount === 0) {
        return {
          effects: [createWarningEffect('선택된 항목이 없어요.')],
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
                  const todayMidnight = new Date();
                  todayMidnight.setHours(0, 0, 0, 0);
                  const todayIso = todayMidnight.toISOString();
                  const selectedItems = state.shoppingList.filter((item) => state.selectedIds.has(item.id));

                  // 모든 선택된 항목을 냉장고에 추가하고 구매 완료 처리
                  for (const item of selectedItems) {
                    await ingredientService.addIngredient({
                      name: item.name,
                      category: item.category,
                      emoji: item.emoji,
                      storage_location: null,
                      purchased_date_time: todayIso,
                      memo: null,
                      quantity: null,
                      unit: null,
                      expired_date_time: null,
                      last_modified_date_time: null,
                      deleted_date_time: null,
                      consumed_date_time: null,
                    });

                    // 구매 완료로 표시
                    await shoppingService.updateShoppingItem(item.id, {
                      is_purchased: true,
                      purchased_date_time: todayMidnight.toISOString(),
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
          effects: [createSuccessEffect(SUCCESS_MESSAGES.SUCCESS_MEMO_UPDATE)],
        };
      } catch (error) {
        console.error('Error updating memo:', error);
        return {
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_MEMO_UPDATE_FAILED)],
        };
      }
    }

    case 'UPDATE_EMOJI': {
      try {
        await shoppingService.updateShoppingItem(intent.payload.id, {
          emoji: intent.payload.emoji,
        });

        const items = await shoppingService.getShoppingList();
        return {
          state: {
            ...state,
            shoppingList: items,
          },
          effects: [createSuccessEffect('이모지가 변경되었어요.')],
        };
      } catch (error) {
        console.error('Error updating emoji:', error);
        return {
          effects: [createErrorEffect('이모지 변경에 실패했어요.')],
        };
      }
    }

    case 'CANCEL_PURCHASE': {
      return {
        effects: [
          {
            type: 'SHOW_CONFIRM',
            payload: {
              title: '구매완료 취소',
              message: `"${intent.payload.name}"의 구매완료를 취소할까요?`,
              onConfirm: async () => {
                try {
                  await shoppingService.updateShoppingItem(intent.payload.id, {
                    is_purchased: false,
                    purchased_date_time: null,
                  });
                  return { success: true };
                } catch (error) {
                  console.error('Error canceling purchase:', error);
                  return { success: false };
                }
              },
              isDanger: false,
            },
          },
        ],
      };
    }

    case 'REPURCHASE': {
      try {
        const item = state.shoppingList.find((i) => i.id === intent.payload.id);

        if (!item) {
          return {
            effects: [createErrorEffect('항목을 찾을 수 없어요.')],
          };
        }

        await shoppingService.addToShoppingList({
          name: item.name,
          category: item.category,
          emoji: item.emoji,
          memo: item.memo,
          last_modified_date_time: null,
          deleted_date_time: null,
        });

        const items = await shoppingService.getShoppingList();
        return {
          state: {
            ...state,
            shoppingList: items,
          },
          effects: [createSuccessEffect(`'${item.name}'을(를) 구매 예정에 추가했어요.`)],
        };
      } catch (error) {
        console.error('Error repurchasing item:', error);
        return {
          effects: [createErrorEffect('재구매 추가에 실패했어요.')],
        };
      }
    }

    case 'DELETE_DATE_ITEMS': {
      const itemCount = intent.payload.itemIds.length;

      return {
        effects: [
          {
            type: 'SHOW_CONFIRM',
            payload: {
              title: '날짜별 항목 삭제',
              message: `${intent.payload.dateKey}의 ${itemCount}개 항목을 삭제할까요?`,
              onConfirm: async () => {
                try {
                  const now = new Date().toISOString();
                  for (const id of intent.payload.itemIds) {
                    await shoppingService.updateShoppingItem(id, {
                      deleted_date_time: now,
                    });
                  }
                  return { success: true, count: itemCount };
                } catch (error) {
                  console.error('Error deleting date items:', error);
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
