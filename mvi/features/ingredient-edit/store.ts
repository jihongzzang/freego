/**
 * Ingredient Edit Store
 *
 * Ingredient Edit 화면의 MVI Store 생성
 */

import { Store } from '@/mvi/base';
import { IngredientEditState, IngredientEditIntent, IngredientEditEffect } from './types';
import { ingredientEditReducer } from './reducer';
import { ingredientEditMiddleware } from './middleware';
import { Category } from '@/data/enums/category';

/**
 * 초기 상태
 */
const initialState: IngredientEditState = {
  ingredient: null,
  editForm: {
    name: '',
    category: Category.VEGETABLE,
    emoji: null,
    quantity: null,
    unit: null,
    purchased_date_time: null,
    expired_date_time: null,
    storage_location: null,
    memo: null,
  },
  loading: true,
  error: null,
  errors: {},
};

/**
 * Ingredient Edit Store 생성 함수
 */
export function createIngredientEditStore(): Store<
  IngredientEditState,
  IngredientEditIntent,
  IngredientEditEffect
> {
  return new Store({
    initialState,
    reducer: ingredientEditReducer,
    middlewares: [ingredientEditMiddleware],
  });
}
