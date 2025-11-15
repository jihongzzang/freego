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
    emoji: null,
    quantity: null,
    unit: null,
    purchased_date_time: null,
    expired_date_time: null,
    storage_location: null,
    memo: null,
  },
  isSubmitting: false,
  errors: {
    name: '',
  },
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
