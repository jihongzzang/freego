/**
 * Cooking Store
 *
 * Cooking 화면의 MVI Store 생성
 */

import { Store } from '@/mvi/base';
import { CookingState, CookingIntent, CookingEffect } from './types';
import { cookingReducer } from './reducer';
import { cookingMiddleware } from './middleware';

/**
 * 초기 상태
 */
const initialState: CookingState = {
  ingredients: [],
  availableRecipes: [],
  selectedRecipe: null,
  loading: true,
  error: null,
};

/**
 * Cooking Store 생성 함수
 */
export function createCookingStore(): Store<CookingState, CookingIntent, CookingEffect> {
  return new Store({
    initialState,
    reducer: cookingReducer,
    middlewares: [cookingMiddleware],
  });
}
