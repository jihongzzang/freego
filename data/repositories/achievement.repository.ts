import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement, Statistics } from '@/data/models/achievement.model';
import { AchievementType } from '@/data/enums/achievement-type';

/**
 * 뱃지 이미지
 */
const BADGE_IMAGES = {
  streak_3d: require('@/assets/images/streak-3d.png'),
  streak_7d: require('@/assets/images/streak-7d.png'),
  streak_30d: require('@/assets/images/streak-30d.png'),
  consume_10: require('@/assets/images/consume-10.png'),
  consume_50: require('@/assets/images/consume-50.png'),
  consume_100: require('@/assets/images/consume-100.png'),
  register_first: require('@/assets/images/frigo-first-ingredient.png'),
  register_10: require('@/assets/images/ingredient-10-registered.png'),
  register_50: require('@/assets/images/ingredient-50-registered.png'),
  register_100: require('@/assets/images/ingredient-100-registered.png'),
  shopping_5: require('@/assets/images/shopping-planner.png'),
  shopping_20: require('@/assets/images/shopping-planner-20.png'),
  shopping_50: require('@/assets/images/shopping-planner-50.png'),
};

/**
 * AsyncStorage 키 상수
 */
const ACHIEVEMENTS_KEY = '@achievements';
const STATISTICS_KEY = '@statistics';

/**
 * 기본 업적 목록
 */
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // 연속 기록
  {
    id: AchievementType.STREAK_3_DAYS,
    type: AchievementType.STREAK_3_DAYS,
    title: '3일 연속 정리왕',
    description: '3일 연속 유통기한 내 소비 달성',
    icon: '🔥',
    category: 'streak',
    target: 3,
    current: 0,
    completed: false,
    claimed: false,
    completed_date_time: null,
    badge_image: BADGE_IMAGES.streak_3d,
  },
  {
    id: AchievementType.STREAK_7_DAYS,
    type: AchievementType.STREAK_7_DAYS,
    title: '일주일 챌린지 마스터',
    description: '7일 연속 유통기한 내 소비 달성',
    icon: '🌟',
    category: 'streak',
    target: 7,
    current: 0,
    completed: false,
    claimed: false,
    completed_date_time: null,
    badge_image: BADGE_IMAGES.streak_7d,
  },
  {
    id: AchievementType.STREAK_30_DAYS,
    type: AchievementType.STREAK_30_DAYS,
    title: '한 달 완벽 관리',
    description: '30일 연속 유통기한 내 소비 달성',
    icon: '👑',
    category: 'streak',
    target: 30,
    current: 0,
    completed: false,
    claimed: false,
    completed_date_time: null,
    badge_image: BADGE_IMAGES.streak_30d,
  },

  // 소비 기록
  {
    id: AchievementType.CONSUME_10,
    type: AchievementType.CONSUME_10,
    title: '첫 걸음',
    description: '재료 10개 소비',
    icon: '🎯',
    category: 'consume',
    target: 10,
    current: 0,
    completed: false,
    claimed: false,
    completed_date_time: null,
    badge_image: BADGE_IMAGES.consume_10,
  },
  {
    id: AchievementType.CONSUME_50,
    type: AchievementType.CONSUME_50,
    title: '알뜰 생활자',
    description: '재료 50개 소비',
    icon: '💪',
    category: 'consume',
    target: 50,
    current: 0,
    completed: false,
    claimed: false,
    completed_date_time: null,
    badge_image: BADGE_IMAGES.consume_50,
  },
  {
    id: AchievementType.CONSUME_100,
    type: AchievementType.CONSUME_100,
    title: '소비의 달인',
    description: '재료 100개 소비',
    icon: '🏆',
    category: 'consume',
    target: 100,
    current: 0,
    completed: false,
    claimed: false,
    completed_date_time: null,
    badge_image: BADGE_IMAGES.consume_100,
  },

  // 등록 기록
  {
    id: AchievementType.REGISTER_FIRST,
    type: AchievementType.REGISTER_FIRST,
    title: '냉장고 첫 등록',
    description: '첫 재료 등록 완료',
    icon: '🎉',
    category: 'register',
    target: 1,
    current: 0,
    completed: false,
    claimed: false,
    completed_date_time: null,
    badge_image: BADGE_IMAGES.register_first,
  },
  {
    id: AchievementType.REGISTER_10,
    type: AchievementType.REGISTER_10,
    title: '재료 수집가',
    description: '재료 10개 등록',
    icon: '📦',
    category: 'register',
    target: 10,
    current: 0,
    completed: false,
    claimed: false,
    completed_date_time: null,
    badge_image: BADGE_IMAGES.register_10,
  },
  {
    id: AchievementType.REGISTER_50,
    type: AchievementType.REGISTER_50,
    title: '풍성한 냉장고',
    description: '재료 50개 등록',
    icon: '🌈',
    category: 'register',
    target: 50,
    current: 0,
    completed: false,
    claimed: false,
    completed_date_time: null,
    badge_image: BADGE_IMAGES.register_50,
  },
  {
    id: AchievementType.REGISTER_100,
    type: AchievementType.REGISTER_100,
    title: '냉장고 마스터',
    description: '재료 100개 등록',
    icon: '⭐',
    category: 'register',
    target: 100,
    current: 0,
    completed: false,
    claimed: false,
    completed_date_time: null,
    badge_image: BADGE_IMAGES.register_100,
  },

  // 장보기
  {
    id: AchievementType.SHOPPING_USE_5,
    type: AchievementType.SHOPPING_USE_5,
    title: '계획적인 쇼핑',
    description: '장보기 목록 5회 완료',
    icon: '🛒',
    category: 'shopping',
    target: 5,
    current: 0,
    completed: false,
    claimed: false,
    completed_date_time: null,
    badge_image: BADGE_IMAGES.shopping_5,
  },
  {
    id: AchievementType.SHOPPING_USE_20,
    type: AchievementType.SHOPPING_USE_20,
    title: '장보기 고수',
    description: '장보기 목록 20회 완료',
    icon: '🛍️',
    category: 'shopping',
    target: 20,
    current: 0,
    completed: false,
    claimed: false,
    completed_date_time: null,
    badge_image: BADGE_IMAGES.shopping_20,
  },
  {
    id: AchievementType.SHOPPING_USE_50,
    type: AchievementType.SHOPPING_USE_50,
    title: '쇼핑 마스터',
    description: '장보기 목록 50회 완료',
    icon: '🎖️',
    category: 'shopping',
    target: 50,
    current: 0,
    completed: false,
    claimed: false,
    completed_date_time: null,
    badge_image: BADGE_IMAGES.shopping_50,
  },
];

/**
 * 기본 통계
 */
const DEFAULT_STATISTICS: Statistics = {
  total_consumed: 0,
  total_registered: 0,
  total_shopping_completed: 0,
  streak_record: {
    current_streak: 0,
    longest_streak: 0,
    last_consume_date: null,
  },
};

/**
 * 업적 데이터 접근 레포지토리
 */
export const achievementRepository = {
  /**
   * 모든 업적 가져오기
   */
  async getAchievements(): Promise<Achievement[]> {
    try {
      const data = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
      if (!data) {
        // 초기 데이터 저장
        await this.saveAchievements(DEFAULT_ACHIEVEMENTS);
        return DEFAULT_ACHIEVEMENTS;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading achievements:', error);
      return DEFAULT_ACHIEVEMENTS;
    }
  },

  /**
   * 업적 저장
   */
  async saveAchievements(achievements: Achievement[]): Promise<void> {
    try {
      await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    } catch (error) {
      console.error('Error saving achievements:', error);
      throw error;
    }
  },

  /**
   * 특정 업적 업데이트
   */
  async updateAchievement(id: string, updates: Partial<Achievement>): Promise<boolean> {
    try {
      const achievements = await this.getAchievements();
      const index = achievements.findIndex((a) => a.id === id);

      if (index !== -1) {
        achievements[index] = {
          ...achievements[index],
          ...updates,
        };
        await this.saveAchievements(achievements);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating achievement:', error);
      throw error;
    }
  },

  /**
   * 통계 가져오기
   */
  async getStatistics(): Promise<Statistics> {
    try {
      const data = await AsyncStorage.getItem(STATISTICS_KEY);
      if (!data) {
        await this.saveStatistics(DEFAULT_STATISTICS);
        return DEFAULT_STATISTICS;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading statistics:', error);
      return DEFAULT_STATISTICS;
    }
  },

  /**
   * 통계 저장
   */
  async saveStatistics(statistics: Statistics): Promise<void> {
    try {
      await AsyncStorage.setItem(STATISTICS_KEY, JSON.stringify(statistics));
    } catch (error) {
      console.error('Error saving statistics:', error);
      throw error;
    }
  },

  /**
   * 통계 업데이트
   */
  async updateStatistics(updates: Partial<Statistics>): Promise<void> {
    try {
      const statistics = await this.getStatistics();
      const newStatistics = {
        ...statistics,
        ...updates,
        streak_record: {
          ...statistics.streak_record,
          ...(updates.streak_record || {}),
        },
      };
      await this.saveStatistics(newStatistics);
    } catch (error) {
      console.error('Error updating statistics:', error);
      throw error;
    }
  },

  /**
   * 뱃지 받기 (claimed 처리)
   */
  async claimBadge(id: string): Promise<boolean> {
    try {
      return await this.updateAchievement(id, { claimed: true });
    } catch (error) {
      console.error('Error claiming badge:', error);
      throw error;
    }
  },

  /**
   * 모든 데이터 초기화
   */
  async resetAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ACHIEVEMENTS_KEY);
      await AsyncStorage.removeItem(STATISTICS_KEY);
    } catch (error) {
      console.error('Error resetting achievements:', error);
      throw error;
    }
  },
};
