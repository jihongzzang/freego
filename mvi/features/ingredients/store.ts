/**
 * Ingredients Store
 *
 * Ingredients 화면의 MVI Store 생성
 */

import { Store } from '@/mvi/base';
import { IngredientsState, IngredientsIntent, IngredientsEffect } from './types';
import { ingredientsReducer } from './reducer';
import { ingredientsMiddleware } from './middleware';

/**
 * 초기 상태
 */
const initialState: IngredientsState = {
  ingredients: [],
  loading: true,
  error: null,
};

/**
 * Ingredients Store 생성 함수
 */
export function createIngredientsStore(): Store<IngredientsState, IngredientsIntent, IngredientsEffect> {
  return new Store({
    initialState,
    reducer: ingredientsReducer,
    middlewares: [ingredientsMiddleware],
  });
}
