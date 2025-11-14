import { Achievement, Statistics } from '@/data/models/achievement.model';
import { achievementRepository } from '@/data/repositories/achievement.repository';
import { AchievementType } from '@/data/enums/achievement-type';

/**
 * 업적 관련 서비스
 */
export const achievementService = {
  /**
   * 모든 업적 가져오기
   */
  async getAchievements(): Promise<Achievement[]> {
    return achievementRepository.getAchievements();
  },

  /**
   * 통계 가져오기
   */
  async getStatistics(): Promise<Statistics> {
    return achievementRepository.getStatistics();
  },

  /**
   * 재료 등록 시 호출
   */
  async onIngredientAdded(count: number = 1): Promise<Achievement[]> {
    try {
      const statistics = await achievementRepository.getStatistics();
      const newTotal = statistics.total_registered + count;

      // 통계 업데이트
      await achievementRepository.updateStatistics({
        total_registered: newTotal,
      });

      // 업적 체크 및 업데이트
      const newlyCompleted: Achievement[] = [];
      const achievements = await achievementRepository.getAchievements();

      for (const achievement of achievements) {
        if (achievement.category === 'register' && !achievement.completed) {
          const updated: Partial<Achievement> = {
            current: newTotal,
          };

          if (newTotal >= achievement.target) {
            updated.completed = true;
            updated.completed_date_time = new Date().toISOString();
            newlyCompleted.push({ ...achievement, ...updated } as Achievement);
          }

          await achievementRepository.updateAchievement(achievement.id, updated);
        }
      }

      return newlyCompleted;
    } catch (error) {
      console.error('Error on ingredient added:', error);
      return [];
    }
  },

  /**
   * 재료 소비 시 호출
   */
  async onIngredientConsumed(expiredDate: string | null): Promise<Achievement[]> {
    try {
      const statistics = await achievementRepository.getStatistics();
      const newTotal = statistics.total_consumed + 1;
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const lastConsumeDate = statistics.streak_record.last_consume_date;

      // 연속 기록 계산
      let newStreak = statistics.streak_record.current_streak;

      // 유통기한 내 소비인지 확인
      const isBeforeExpiry = expiredDate ? new Date() <= new Date(expiredDate) : true;

      if (isBeforeExpiry) {
        if (!lastConsumeDate) {
          // 첫 소비
          newStreak = 1;
        } else {
          const lastDate = new Date(lastConsumeDate);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            // 연속 소비
            newStreak += 1;
          } else if (diffDays === 0) {
            // 같은 날 소비 (유지)
            newStreak = statistics.streak_record.current_streak;
          } else {
            // 연속 끊김
            newStreak = 1;
          }
        }
      } else {
        // 유통기한 지난 소비 - 연속 끊김
        newStreak = 0;
      }

      const longestStreak = Math.max(statistics.streak_record.longest_streak, newStreak);

      // 통계 업데이트
      await achievementRepository.updateStatistics({
        total_consumed: newTotal,
        streak_record: {
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_consume_date: today,
        },
      });

      // 업적 체크 및 업데이트
      const newlyCompleted: Achievement[] = [];
      const achievements = await achievementRepository.getAchievements();

      for (const achievement of achievements) {
        if (!achievement.completed) {
          let shouldUpdate = false;
          const updated: Partial<Achievement> = {};

          // 소비 개수 업적
          if (achievement.category === 'consume') {
            updated.current = newTotal;
            shouldUpdate = true;

            if (newTotal >= achievement.target) {
              updated.completed = true;
              updated.completed_date_time = new Date().toISOString();
              newlyCompleted.push({ ...achievement, ...updated } as Achievement);
            }
          }

          // 연속 기록 업적
          if (achievement.category === 'streak') {
            updated.current = longestStreak;
            shouldUpdate = true;

            if (longestStreak >= achievement.target) {
              updated.completed = true;
              updated.completed_date_time = new Date().toISOString();
              newlyCompleted.push({ ...achievement, ...updated } as Achievement);
            }
          }

          if (shouldUpdate) {
            await achievementRepository.updateAchievement(achievement.id, updated);
          }
        }
      }

      return newlyCompleted;
    } catch (error) {
      console.error('Error on ingredient consumed:', error);
      return [];
    }
  },

  /**
   * 장보기 완료 시 호출
   */
  async onShoppingCompleted(): Promise<Achievement[]> {
    try {
      const statistics = await achievementRepository.getStatistics();
      const newTotal = statistics.total_shopping_completed + 1;

      // 통계 업데이트
      await achievementRepository.updateStatistics({
        total_shopping_completed: newTotal,
      });

      // 업적 체크 및 업데이트
      const newlyCompleted: Achievement[] = [];
      const achievements = await achievementRepository.getAchievements();

      for (const achievement of achievements) {
        if (achievement.category === 'shopping' && !achievement.completed) {
          const updated: Partial<Achievement> = {
            current: newTotal,
          };

          if (newTotal >= achievement.target) {
            updated.completed = true;
            updated.completed_date_time = new Date().toISOString();
            newlyCompleted.push({ ...achievement, ...updated } as Achievement);
          }

          await achievementRepository.updateAchievement(achievement.id, updated);
        }
      }

      return newlyCompleted;
    } catch (error) {
      console.error('Error on shopping completed:', error);
      return [];
    }
  },

  /**
   * 뱃지 받기
   */
  async claimBadge(id: string): Promise<boolean> {
    try {
      return await achievementRepository.claimBadge(id);
    } catch (error) {
      console.error('Error claiming badge:', error);
      return false;
    }
  },

  /**
   * 모든 데이터 초기화
   */
  async resetAll(): Promise<void> {
    return achievementRepository.resetAll();
  },
};
