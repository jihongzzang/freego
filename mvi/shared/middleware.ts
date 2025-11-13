/**
 * MVI Shared Middleware Helpers
 *
 * 여러 feature에서 공통으로 사용하는 Middleware 로직
 */

import { MiddlewareResult, Effect } from '@/mvi/base';
import { IngredientListState, CommonEffect } from './types';
import { ingredientService } from '@/services/ingredient.service';
import { enrichIngredients, createErrorEffect } from './helpers';
import ERROR_MESSAGES from '@/constants/toast/errorMessages';

/**
 * 재료 로딩 공통 로직
 *
 * ingredientService에서 데이터를 가져와서 enrichment 후 반환
 */
export async function handleLoadIngredients<
  TState extends IngredientListState,
  TEffect extends Effect = CommonEffect,
>(): Promise<MiddlewareResult<TState, TEffect>> {
  try {
    const data = await ingredientService.getIngredients();
    const ingredients = enrichIngredients(data);

    return {
      state: {
        ingredients,
        loading: false,
        error: null,
      } as any as TState,
    };
  } catch (error) {
    return {
      state: {
        loading: false,
        error: error instanceof Error ? error.message : '데이터 로드 실패',
      } as any as TState,
      effects: [createErrorEffect(ERROR_MESSAGES.ERROR_INGREDIENT_LOAD_FAILED)] as any as TEffect[],
    };
  }
}
