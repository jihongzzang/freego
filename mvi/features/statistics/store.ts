/**
 * Statistics Store
 *
 * Statistics 화면의 MVI Store 생성
 */

import { Store } from '@/mvi/base';
import { StatisticsState, StatisticsIntent, StatisticsEffect } from './types';
import { statisticsReducer } from './reducer';
import { statisticsMiddleware } from './middleware';

/**
 * 초기 상태
 */
const initialState: StatisticsState = {
  stats: {
    totalIngredients: 0,
    expiringItems: 0,
    totalConsumed: 0,
    categoryDistribution: {},
    storageDistribution: {},
    recentConsumptions: [],
  },
  loading: true,
  error: null,
};

/**
 * Statistics Store 생성 함수
 */
export function createStatisticsStore(): Store<
  StatisticsState,
  StatisticsIntent,
  StatisticsEffect
> {
  return new Store({
    initialState,
    reducer: statisticsReducer,
    middlewares: [statisticsMiddleware],
  });
}
