/**
 * Achievement Reducer
 *
 * Intent를 받아서 새로운 State를 반환 (동기)
 */

import { Reducer } from '@/mvi/base';
import { AchievementState, AchievementIntent } from './types';

export const achievementReducer: Reducer<AchievementState, AchievementIntent> = (state, intent): AchievementState => {
  switch (intent.type) {
    case 'LOAD_ACHIEVEMENTS': {
      console.log('🟡 LOAD_ACHIEVEMENTS (reducer)');
      return state;
    }

    case 'REFRESH_ACHIEVEMENTS': {
      console.log('🔵 REFRESH_ACHIEVEMENTS (reducer)');
      return state;
    }

    default:
      return state;
  }
};
