/**
 * MVI Shared Reducers
 *
 * 여러 feature에서 공통으로 사용하는 Reducer 로직
 */

import { IngredientListState, LoadIngredientsIntent } from './types';

/**
 * 재료 로딩 관련 공통 Reducer 로직
 *
 * LOAD_INGREDIENTS, LOAD_INGREDIENTS_SUCCESS, LOAD_INGREDIENTS_ERROR 처리
 */
export function handleLoadIngredientsReducer<TState extends IngredientListState, TIntent>(
  state: TState,
  intent: TIntent,
): TState {
  // 타입 가드로 LoadIngredientsIntent인지 확인
  if (
    typeof intent === 'object' &&
    intent !== null &&
    'type' in intent &&
    (intent.type === 'LOAD_INGREDIENTS' ||
      intent.type === 'LOAD_INGREDIENTS_SUCCESS' ||
      intent.type === 'LOAD_INGREDIENTS_ERROR')
  ) {
    const loadIntent = intent as unknown as LoadIngredientsIntent;

    switch (loadIntent.type) {
      case 'LOAD_INGREDIENTS':
        return state;

      case 'LOAD_INGREDIENTS_SUCCESS':
        return {
          ...state,
          ingredients: loadIntent.payload,
          loading: false,
          error: null,
        };

      case 'LOAD_INGREDIENTS_ERROR':
        return {
          ...state,
          loading: false,
          error: loadIntent.payload,
        };
    }
  }

  return state;
}
