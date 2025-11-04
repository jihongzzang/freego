/**
 * Expiring Store
 *
 * Expiring 화면의 MVI Store 생성
 */

import { Store } from '@/mvi/base';
import { ExpiringState, ExpiringIntent, ExpiringEffect } from './types';
import { expiringReducer } from './reducer';
import { expiringMiddleware } from './middleware';

/**
 * 초기 상태
 */
const initialState: ExpiringState = {
  ingredients: [],
  loading: true,
  error: null,
};

/**
 * Expiring Store 생성 함수
 */
export function createExpiringStore(): Store<ExpiringState, ExpiringIntent, ExpiringEffect> {
  return new Store({
    initialState,
    reducer: expiringReducer,
    middlewares: [expiringMiddleware],
  });
}
