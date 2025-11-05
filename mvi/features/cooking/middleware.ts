/**
 * Cooking Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { CookingState, CookingIntent, CookingEffect } from './types';
import { storage } from '@/lib/storage';
import { recipes } from '@/lib/recipes';

/**
 * Cooking Middleware
 */
export const cookingMiddleware: Middleware<
  CookingState,
  CookingIntent,
  CookingEffect
> = async (
  state,
  intent,
): Promise<MiddlewareResult<CookingState, CookingEffect>> => {
  switch (intent.type) {
    case 'LOAD_INGREDIENTS': {
      try {
        const data = await storage.getIngredients();

        // 만들 수 있는 레시피 확인
        const available = recipes.filter((recipe) => {
          return recipe.ingredients.every((recipeIng) => {
            const userIng = data.find(
              (ui) =>
                ui.name.toLowerCase().includes(recipeIng.name.toLowerCase()) ||
                recipeIng.name.toLowerCase().includes(ui.name.toLowerCase()),
            );
            return userIng?.quantity && userIng.quantity >= recipeIng.quantity;
          });
        });

        return {
          state: {
            ...state,
            ingredients: data,
            availableRecipes: available,
            loading: false,
            error: null,
          },
        };
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        return {
          state: {
            ...state,
            loading: false,
            error: error instanceof Error ? error.message : '데이터 로드 실패',
          },
        };
      }
    }

    case 'COOK_RECIPE': {
      const recipe = intent.payload;

      // 재료가 충분한지 확인
      const canMake = state.availableRecipes.some((r) => r.id === recipe.id);

      if (!canMake) {
        return {
          effects: [
            {
              type: 'SHOW_ALERT',
              payload: {
                title: '알림',
                message: '재료가 부족해요. 추가해볼까요?',
                variant: 'warning',
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
              title: '요리하기',
              message: `${recipe.name}을(를) 만들까요? 재료가 자동으로 차감돼요.`,
              onConfirm: async () => {
                try {
                  for (const recipeIng of recipe.ingredients) {
                    const userIng = state.ingredients.find(
                      (ui) =>
                        ui.name
                          .toLowerCase()
                          .includes(recipeIng.name.toLowerCase()) ||
                        recipeIng.name
                          .toLowerCase()
                          .includes(ui.name.toLowerCase()),
                    );

                    if (userIng) {
                      const newQuantity = userIng.quantity - recipeIng.quantity;
                      if (newQuantity <= 0) {
                        await storage.deleteIngredient(userIng.id);
                      } else {
                        await storage.updateIngredient(userIng.id, {
                          quantity: newQuantity,
                        });
                      }
                    }
                  }
                } catch (error) {
                  console.error('Error cooking:', error);
                }
              },
            },
          },
        ],
      };
    }

    default:
      return {};
  }
};
