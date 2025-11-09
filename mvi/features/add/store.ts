/**
 * Add Store
 *
 * Add 화면의 MVI Store 생성
 */

import { Store } from '@/mvi/base';
import { AddState, AddIntent, AddEffect } from './types';
import { addReducer } from './reducer';
import { addMiddleware } from './middleware';
import { Category } from '@/data/enums/category';

/**
 * 초기 상태
 */
const initialState: AddState = {
  form: {
    name: '',
    category: Category.VEGETABLE,
    quantity: undefined,
    unit: undefined,
    purchased_date: undefined,
    expiry_date: undefined,
    storage_location: undefined,
    memo: undefined,
  },
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
