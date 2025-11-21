/**
 * Achievement Reducer Tests
 */

import { achievementReducer } from '@/mvi/features/achievement/reducer';
import { AchievementState, AchievementIntent } from '@/mvi/features/achievement/types';
import { Achievement, Statistics } from '@/data/models/achievement.model';
import { AchievementType } from '@/data/enums/achievement-type';

const mockAchievement: Achievement = {
  id: AchievementType.CONSUME_10,
  type: AchievementType.CONSUME_10,
  title: '첫 번째 발걸음',
  description: '재료 10개 소비하기',
  icon: '🎯',
  category: 'consume',
  target: 10,
  current: 10,
  completed: true,
  claimed: false,
  completed_date_time: '2024-01-15T00:00:00.000Z',
  badge_image: null,
};

const mockStatistics: Statistics = {
  total_consumed: 25,
  total_registered: 50,
  total_shopping_completed: 10,
  streak_record: {
    current_streak: 5,
    longest_streak: 10,
    last_consume_date: '2024-01-20',
  },
};

const createMockState = (overrides?: Partial<AchievementState>): AchievementState => ({
  achievements: [],
  statistics: null,
  loading: false,
  error: null,
  ...overrides,
});

describe('achievementReducer', () => {
  const originalConsoleLog = console.log;

  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  describe('LOAD_ACHIEVEMENTS', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState({
        achievements: [mockAchievement],
        statistics: mockStatistics,
      });
      const intent: AchievementIntent = { type: 'LOAD_ACHIEVEMENTS' };

      const result = achievementReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('REFRESH_ACHIEVEMENTS', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState({
        achievements: [mockAchievement],
        statistics: mockStatistics,
      });
      const intent: AchievementIntent = { type: 'REFRESH_ACHIEVEMENTS' };

      const result = achievementReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('CLAIM_BADGE', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState({
        achievements: [mockAchievement],
        statistics: mockStatistics,
      });
      const intent: AchievementIntent = {
        type: 'CLAIM_BADGE',
        payload: { achievementId: AchievementType.CONSUME_10 },
      };

      const result = achievementReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('unknown intent', () => {
    it('알 수 없는 intent는 상태를 변경하지 않는다', () => {
      const state = createMockState({
        achievements: [mockAchievement],
        statistics: mockStatistics,
      });
      const intent = { type: 'UNKNOWN_INTENT' } as any;

      const result = achievementReducer(state, intent);

      expect(result).toEqual(state);
    });
  });
});
