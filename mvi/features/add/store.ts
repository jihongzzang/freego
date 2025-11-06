/**
 * Add Store
 *
 * Add 화면의 MVI Store 생성
 */

import { Store } from '@/mvi/base';
import { AddState, AddIntent, AddEffect } from './types';
import { addReducer } from './reducer';
import { addMiddleware } from './middleware';

/**
 * 초기 상태
 */
const initialState: AddState = {
  form: {
    name: '',
    category: 'vegetables',
    quantity: undefined,
    unit: undefined,
    purchase_date: undefined,
    expiry_date: '',
    storage_location: 'fridge',
    memo: '',
  },
  mode: 'select',
  isSubmitting: false,
  errors: {},
};

/**
 * Add Store 생성 함수
 */
export function createAddStore(): Store<AddState, AddIntent, AddEffect> {
  return new Store({
    initialState,
    reducer: addReducer,
    middlewares: [addMiddleware],
  });
}
