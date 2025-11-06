/**
 * Ingredient Detail Store
 *
 * Ingredient Detail 화면의 MVI Store 생성
 */

import { Store } from '@/mvi/base';
import {
  IngredientDetailState,
  IngredientDetailIntent,
  IngredientDetailEffect,
} from './types';
import { ingredientDetailReducer } from './reducer';
import { ingredientDetailMiddleware } from './middleware';

/**
 * 초기 상태
 */
const initialState: IngredientDetailState = {
  ingredient: null,
  editForm: {
    name: '',
    category: 'vegetables',
    quantity: '',
    unit: '',
    expiry_date: '',
    storage_location: 'fridge',
    memo: '',
  },
  isEditing: false,
  loading: true,
  error: null,
};

/**
 * Ingredient Detail Store 생성 함수
 */
export function createIngredientDetailStore(): Store<
  IngredientDetailState,
  IngredientDetailIntent,
  IngredientDetailEffect
> {
  return new Store({
    initialState,
    reducer: ingredientDetailReducer,
    middlewares: [ingredientDetailMiddleware],
  });
}
