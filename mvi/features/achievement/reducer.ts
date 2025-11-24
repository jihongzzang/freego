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
      return state;
    }

    case 'REFRESH_ACHIEVEMENTS': {
      return state;
    }

    default:
      return state;
  }
};
