/**
 * Achievement Store
 *
 * Achievement 화면의 MVI Store 생성
 */

import { Store } from '@/mvi/base';
import { AchievementState, AchievementIntent, AchievementEffect } from './types';
import { achievementReducer } from './reducer';
import { achievementMiddleware } from './middleware';

/**
 * 초기 상태
 */
const initialState: AchievementState = {
  achievements: [],
  statistics: null,
  loading: false,
  error: null,
};

/**
 * Achievement Store 생성 함수
 */
export function createAchievementStore(): Store<AchievementState, AchievementIntent, AchievementEffect> {
  return new Store({
    initialState,
    reducer: achievementReducer,
    middlewares: [achievementMiddleware],
  });
}
