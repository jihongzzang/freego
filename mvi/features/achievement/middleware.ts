/**
 * Achievement Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { AchievementState, AchievementIntent, AchievementEffect } from './types';
import { achievementService } from '@/services/achievement.service';
import { createErrorEffect } from '@/mvi/shared';

/**
 * Achievement Middleware
 */
export const achievementMiddleware: Middleware<AchievementState, AchievementIntent, AchievementEffect> = async (
  state,
  intent,
): Promise<MiddlewareResult<AchievementState, AchievementEffect>> => {
  switch (intent.type) {
    case 'LOAD_ACHIEVEMENTS':
    case 'REFRESH_ACHIEVEMENTS': {
      try {
        console.log('🟡 LOAD_ACHIEVEMENTS (middleware)');
        const [achievements, statistics] = await Promise.all([
          achievementService.getAchievements(),
          achievementService.getStatistics(),
        ]);

        return {
          state: {
            ...state,
            achievements,
            statistics,
            loading: false,
            error: null,
          },
        };
      } catch (error) {
        console.error('Error loading achievements:', error);
        return {
          state: {
            ...state,
            loading: false,
            error: error instanceof Error ? error.message : '업적 로드 실패',
          },
          effects: [createErrorEffect('업적을 불러오지 못했어요.')],
        };
      }
    }

    case 'CLAIM_BADGE': {
      try {
        console.log('🎁 CLAIM_BADGE (middleware):', intent.payload.achievementId);
        const success = await achievementService.claimBadge(intent.payload.achievementId);

        if (success) {
          // 업적 목록 다시 로드
          const achievements = await achievementService.getAchievements();
          return {
            state: {
              ...state,
              achievements,
            },
          };
        }

        return {};
      } catch (error) {
        console.error('Error claiming badge:', error);
        return {
          effects: [createErrorEffect('뱃지를 받지 못했어요.')],
        };
      }
    }

    default:
      return {};
  }
};
