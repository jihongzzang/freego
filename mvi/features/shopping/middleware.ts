/**
 * Shopping List Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { ShoppingState, ShoppingIntent, ShoppingEffect } from './types';
import { shoppingService } from '@/services/shopping.service';
import { ingredientService } from '@/services/ingredient.service';
import { createErrorEffect, createSuccessEffect, createWarningEffect } from '@/mvi/shared';
import i18n from '@/locales';

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
            error: error instanceof Error ? error.message : i18n.t('shopping.messages.dataLoadFailed'),
          },
          effects: [createErrorEffect(i18n.t('shopping.messages.loadFailed'))],
        };
      }
    }

    case 'DELETE_SELECTED': {
      const selectedCount = state.selectedIds.size;

      if (selectedCount === 0) {
        return {
          effects: [createWarningEffect(i18n.t('shopping.messages.noSelectedItems'))],
        };
      }

      return {
        effects: [
          {
            type: 'SHOW_CONFIRM',
            payload: {
              title: i18n.t('shopping.messages.deleteSelectedTitle'),
              message: i18n.t('shopping.messages.deleteSelectedConfirm', { count: selectedCount }),
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
              actionType: 'delete',
            },
          },
        ],
      };
    }

    case 'SUBMIT_ADD_ITEM': {
      if (!intent.payload.name.trim()) {
        return {
          effects: [createErrorEffect(i18n.t('shopping.messages.missingName'))],
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
          effects: [
            createSuccessEffect(i18n.t('shopping.messages.addedToShoppingList', { name: intent.payload.name.trim() })),
          ],
        };
      } catch (error) {
        console.error('Error adding shopping item:', error);
        return {
          effects: [createErrorEffect(i18n.t('shopping.messages.addFailed'))],
        };
      }
    }

    case 'DELETE_ITEM': {
      return {
        effects: [
          {
            type: 'SHOW_CONFIRM',
            payload: {
              title: i18n.t('shopping.messages.deleteItemTitle'),
              message: i18n.t('shopping.messages.deleteItemConfirm', { name: intent.payload.name }),
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
              actionType: 'delete',
            },
          },
        ],
      };
    }

    case 'ADD_ITEM_TO_STORAGE': {
      try {
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const todayIso = todayMidnight.toISOString();
        const item = state.shoppingList.find((i) => i.id === intent.payload.id);

        if (!item) {
          return {
            effects: [createErrorEffect(i18n.t('shopping.messages.ingredientNotFound'))],
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
          effects: [createSuccessEffect(i18n.t('shopping.messages.addedToFridge', { name: intent.payload.name }))],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(i18n.t('shopping.messages.ingredientAddError'))],
        };
      }
    }

    case 'ADD_SELECTED_TO_STORAGE': {
      const selectedCount = state.selectedIds.size;

      if (selectedCount === 0) {
        return {
          effects: [createWarningEffect(i18n.t('shopping.messages.noSelectedItems'))],
        };
      }

      return {
        effects: [
          {
            type: 'SHOW_CONFIRM',
            payload: {
              title: i18n.t('shopping.messages.addToFridgeTitle'),
              message: i18n.t('shopping.messages.addToFridgeConfirm', { count: selectedCount }),
              onConfirm: async () => {
                try {
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
              actionType: 'add_to_storage',
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
          effects: [createSuccessEffect(i18n.t('shopping.messages.memoUpdated'))],
        };
      } catch (error) {
        console.error('Error updating memo:', error);
        return {
          effects: [createErrorEffect(i18n.t('shopping.messages.memoUpdateFailed'))],
        };
      }
    }

    case 'UPDATE_NAME': {
      try {
        await shoppingService.updateShoppingItem(intent.payload.id, {
          name: intent.payload.name,
        });

        const items = await shoppingService.getShoppingList();
        return {
          state: {
            ...state,
            shoppingList: items,
          },
          effects: [createSuccessEffect(i18n.t('shopping.messages.nameUpdated'))],
        };
      } catch (error) {
        console.error('Error updating memo:', error);
        return {
          effects: [createErrorEffect(i18n.t('shopping.messages.nameUpdateFailed'))],
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
          effects: [createSuccessEffect(i18n.t('shopping.messages.emojiUpdated'))],
        };
      } catch (error) {
        console.error('Error updating emoji:', error);
        return {
          effects: [createErrorEffect(i18n.t('shopping.messages.emojiUpdateFailed'))],
        };
      }
    }

    case 'CANCEL_PURCHASE': {
      return {
        effects: [
          {
            type: 'SHOW_CONFIRM',
            payload: {
              title: i18n.t('shopping.messages.cancelPurchaseTitle'),
              message: i18n.t('shopping.messages.cancelPurchaseConfirm', { name: intent.payload.name }),
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
              actionType: 'cancel_purchase',
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
            effects: [createErrorEffect(i18n.t('shopping.messages.itemNotFound'))],
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
          effects: [createSuccessEffect(i18n.t('shopping.messages.addedToUnpurchased', { name: item.name }))],
        };
      } catch (error) {
        console.error('Error repurchasing item:', error);
        return {
          effects: [createErrorEffect(i18n.t('shopping.messages.repurchaseFailed'))],
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
              title: i18n.t('shopping.messages.deleteDateItemsTitle'),
              message: i18n.t('shopping.messages.deleteDateItemsConfirm', {
                dateKey: intent.payload.dateKey,
                count: itemCount,
              }),
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
              actionType: 'delete',
            },
          },
        ],
      };
    }

    default:
      return {};
  }
};
