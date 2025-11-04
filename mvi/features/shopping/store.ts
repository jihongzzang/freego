/**
 * Shopping Store
 *
 * Shopping 화면의 MVI Store 생성
 */

import { Store } from '@/mvi/base';
import { ShoppingState, ShoppingIntent, ShoppingEffect } from './types';
import { shoppingReducer } from './reducer';
import { shoppingMiddleware } from './middleware';

/**
 * 초기 상태
 */
const initialState: ShoppingState = {
  shoppingList: [],
  loading: true,
  error: null,
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
