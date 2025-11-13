/**
 * Shopping Store
 *
 * Shopping 화면의 MVI Store 생성
 */

import { Store } from '@/mvi/base';
import { ShoppingState, ShoppingIntent, ShoppingEffect } from './types';
import { shoppingReducer } from './reducer';
import { shoppingMiddleware } from './middleware';
import { Category } from '@/data/enums/category';

/**
 * 초기 상태
 */
const initialState: ShoppingState = {
  shoppingList: [],
  selectedIds: new Set<string>(),
  loading: false,
  error: null,
  isAddingItem: false,
  addForm: {
    name: '',
    category: Category.VEGETABLE,
  },
};

/**
 * Shopping Store 생성 함수
 */
export function createShoppingStore(): Store<ShoppingState, ShoppingIntent, ShoppingEffect> {
  return new Store({
    initialState,
    reducer: shoppingReducer,
    middlewares: [shoppingMiddleware],
  });
}
