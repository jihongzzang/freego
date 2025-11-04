/**
 * Home Store
 *
 * Home 화면의 MVI Store 생성
 */

import { Store } from '@/mvi/base';
import { HomeState, HomeIntent, HomeEffect } from './types';
import { homeReducer } from './reducer';
import { homeMiddleware } from './middleware';

/**
 * 초기 상태
 */
const initialState: HomeState = {
  ingredients: [],
  loading: true,
  error: null,
};

/**
 * Home Store 생성 함수
 */
export function createHomeStore(): Store<HomeState, HomeIntent, HomeEffect> {
  return new Store({
    initialState,
    reducer: homeReducer,
    middlewares: [homeMiddleware],
  });
}
