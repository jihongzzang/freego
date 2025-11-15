/**
 * Ingredients Reducer
 *
 * Intent를 받아서 새로운 State를 반환 (동기)
 */

import { Reducer } from '@/mvi/base';
import { IngredientsState, IngredientsIntent } from './types';
import { handleLoadIngredientsReducer } from '@/mvi/shared';

export const ingredientsReducer: Reducer<IngredientsState, IngredientsIntent> = (
  state,
  intent,
): IngredientsState => {
  // 공통 로딩 로직 처리
  const commonState = handleLoadIngredientsReducer(state, intent);
  if (commonState !== state) {
    return commonState;
  }

  // Ingredients feature 특화 로직
  switch (intent.type) {
    // 네비게이션 및 삭제 액션들은 미들웨어에서 처리
    case 'DELETE_INGREDIENT':
    case 'ADD_TO_SHOPPING_LIST_INGREDIENT':
    case 'NAVIGATE_TO_ADD':
    case 'NAVIGATE_TO_DETAIL':
    case 'NAVIGATE_TO_DETAIL_EDIT':
      return state;

    default:
      return state;
  }
};
