/**
 * Home Reducer
 *
 * Intent를 받아서 새로운 State를 반환 (동기)
 */

import { Reducer } from '@/mvi/base';
import { HomeState, HomeIntent } from './types';
import { handleLoadIngredientsReducer } from '@/mvi/shared';

export const homeReducer: Reducer<HomeState, HomeIntent> = (state, intent): HomeState => {
  // 공통 로딩 로직 처리
  const commonState = handleLoadIngredientsReducer(state, intent);
  if (commonState !== state) {
    return commonState;
  }

  // Home feature 특화 로직
  switch (intent.type) {
    default:
      return state;
  }
};
