/**
 * Statistics Reducer
 *
 * Intent를 받아서 새로운 State를 반환 (동기)
 */

import { Reducer } from '@/mvi/base';
import { StatisticsState, StatisticsIntent } from './types';

export const statisticsReducer: Reducer<StatisticsState, StatisticsIntent> = (
  state,
  intent
): StatisticsState => {
  switch (intent.type) {
    case 'LOAD_STATISTICS':
      return {
        ...state,
        loading: true,
        error: null,
      };

    default:
      return state;
  }
};
