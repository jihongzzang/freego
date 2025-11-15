/**
 * Achievement Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { Achievement, Statistics } from '@/data/models/achievement.model';
import { CommonEffect } from '@/mvi/shared';

/**
 * Achievement State
 */
export interface AchievementState extends State {
  achievements: Achievement[];
  statistics: Statistics | null;
  loading: boolean;
  error: string | null;
}

/**
 * Achievement Intent (사용자 액션)
 */
export type AchievementIntent =
  | { type: 'LOAD_ACHIEVEMENTS' }
  | { type: 'REFRESH_ACHIEVEMENTS' }
  | { type: 'CLAIM_BADGE'; payload: { achievementId: string } };

/**
 * Achievement Effect (부수 효과)
 */
export type AchievementEffect = CommonEffect;
