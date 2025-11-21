/**
 * Achievement Middleware Tests
 */

import { achievementMiddleware } from '@/mvi/features/achievement/middleware';
import { AchievementState, AchievementIntent } from '@/mvi/features/achievement/types';
import { achievementService } from '@/services/achievement.service';
import { Achievement, Statistics } from '@/data/models/achievement.model';
import { AchievementType } from '@/data/enums/achievement-type';

jest.mock('@/services/achievement.service', () => ({
  achievementService: {
    getAchievements: jest.fn(),
    getStatistics: jest.fn(),
    claimBadge: jest.fn(),
  },
}));

jest.mock('@/mvi/shared', () => ({
  createSuccessEffect: jest.fn((message) => ({
    type: 'SHOW_TOAST',
    payload: { message, variant: 'success' },
  })),
  createErrorEffect: jest.fn((message) => ({
    type: 'SHOW_TOAST',
    payload: { message, variant: 'error' },
  })),
}));

const mockAchievementService = achievementService as jest.Mocked<typeof achievementService>;

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

describe('achievementMiddleware', () => {
  const originalConsoleError = console.error;
  const originalConsoleLog = console.log;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    console.log = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
  });

  describe('LOAD_ACHIEVEMENTS', () => {
    it('업적과 통계를 성공적으로 로드한다', async () => {
      const state = createMockState();
      const intent: AchievementIntent = { type: 'LOAD_ACHIEVEMENTS' };

      mockAchievementService.getAchievements.mockResolvedValue([mockAchievement]);
      mockAchievementService.getStatistics.mockResolvedValue(mockStatistics);

      const result = await achievementMiddleware(state, intent);

      expect(mockAchievementService.getAchievements).toHaveBeenCalled();
      expect(mockAchievementService.getStatistics).toHaveBeenCalled();
      expect(result.state?.achievements).toEqual([mockAchievement]);
      expect(result.state?.statistics).toEqual(mockStatistics);
      expect(result.state?.loading).toBe(false);
      expect(result.state?.error).toBeNull();
    });

    it('로드 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState();
      const intent: AchievementIntent = { type: 'LOAD_ACHIEVEMENTS' };

      mockAchievementService.getAchievements.mockRejectedValue(new Error('Load failed'));

      const result = await achievementMiddleware(state, intent);

      expect(result.state?.loading).toBe(false);
      expect(result.state?.error).toBe('Load failed');
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });

    it('Error가 아닌 예외 발생 시 기본 메시지를 표시한다', async () => {
      const state = createMockState();
      const intent: AchievementIntent = { type: 'LOAD_ACHIEVEMENTS' };

      mockAchievementService.getAchievements.mockRejectedValue('string error');

      const result = await achievementMiddleware(state, intent);

      expect(result.state?.error).toBe('업적 로드 실패');
    });
  });

  describe('REFRESH_ACHIEVEMENTS', () => {
    it('업적과 통계를 새로고침한다', async () => {
      const state = createMockState({
        achievements: [mockAchievement],
        statistics: mockStatistics,
      });
      const intent: AchievementIntent = { type: 'REFRESH_ACHIEVEMENTS' };

      const updatedAchievement = { ...mockAchievement, current: 15 };
      const updatedStatistics = { ...mockStatistics, total_consumed: 30 };

      mockAchievementService.getAchievements.mockResolvedValue([updatedAchievement]);
      mockAchievementService.getStatistics.mockResolvedValue(updatedStatistics);

      const result = await achievementMiddleware(state, intent);

      expect(result.state?.achievements).toEqual([updatedAchievement]);
      expect(result.state?.statistics).toEqual(updatedStatistics);
      expect(result.state?.loading).toBe(false);
    });

    it('새로고침 실패 시 에러를 반환한다', async () => {
      const state = createMockState();
      const intent: AchievementIntent = { type: 'REFRESH_ACHIEVEMENTS' };

      mockAchievementService.getAchievements.mockRejectedValue(new Error('Refresh failed'));

      const result = await achievementMiddleware(state, intent);

      expect(result.state?.error).toBe('Refresh failed');
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('CLAIM_BADGE', () => {
    it('뱃지를 성공적으로 받고 업적 목록을 다시 로드한다', async () => {
      const state = createMockState({ achievements: [mockAchievement] });
      const intent: AchievementIntent = {
        type: 'CLAIM_BADGE',
        payload: { achievementId: AchievementType.CONSUME_10 },
      };

      const claimedAchievement = { ...mockAchievement, claimed: true };
      mockAchievementService.claimBadge.mockResolvedValue(true);
      mockAchievementService.getAchievements.mockResolvedValue([claimedAchievement]);

      const result = await achievementMiddleware(state, intent);

      expect(mockAchievementService.claimBadge).toHaveBeenCalledWith(AchievementType.CONSUME_10);
      expect(mockAchievementService.getAchievements).toHaveBeenCalled();
      expect(result.state?.achievements).toEqual([claimedAchievement]);
    });

    it('뱃지 받기 실패 시 빈 객체를 반환한다', async () => {
      const state = createMockState({ achievements: [mockAchievement] });
      const intent: AchievementIntent = {
        type: 'CLAIM_BADGE',
        payload: { achievementId: AchievementType.CONSUME_10 },
      };

      mockAchievementService.claimBadge.mockResolvedValue(false);

      const result = await achievementMiddleware(state, intent);

      expect(mockAchievementService.claimBadge).toHaveBeenCalledWith(AchievementType.CONSUME_10);
      expect(mockAchievementService.getAchievements).not.toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('뱃지 받기 에러 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({ achievements: [mockAchievement] });
      const intent: AchievementIntent = {
        type: 'CLAIM_BADGE',
        payload: { achievementId: AchievementType.CONSUME_10 },
      };

      mockAchievementService.claimBadge.mockRejectedValue(new Error('Claim failed'));

      const result = await achievementMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('unknown intent', () => {
    it('알 수 없는 intent는 빈 객체를 반환한다', async () => {
      const state = createMockState();
      const intent = { type: 'UNKNOWN_INTENT' } as any;

      const result = await achievementMiddleware(state, intent);

      expect(result).toEqual({});
    });
  });
});
