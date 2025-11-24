import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement, Statistics } from '@/data/models/achievement.model';
import { AchievementType } from '@/data/enums/achievement-type';
import i18n from '@/locales';

/**
 * 뱃지 이미지 (한국어)
 */
const BADGE_IMAGES_KO = {
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
 * 뱃지 이미지 (영어)
 */
const BADGE_IMAGES_EN = {
  streak_3d: require('@/assets/images/streak-3d-en.png'),
  streak_7d: require('@/assets/images/streak-7d-en.png'),
  streak_30d: require('@/assets/images/streak-30d-en.png'),
  consume_10: require('@/assets/images/consume-10-en.png'),
  consume_50: require('@/assets/images/consume-50-en.png'),
  consume_100: require('@/assets/images/consume-100-en.png'),
  register_first: require('@/assets/images/frigo-first-ingredient-en.png'),
  register_10: require('@/assets/images/ingredient-10-registered-en.png'),
  register_50: require('@/assets/images/ingredient-50-registered-en.png'),
  register_100: require('@/assets/images/ingredient-100-registered-en.png'),
  shopping_5: require('@/assets/images/shopping-planner-en.png'),
  shopping_20: require('@/assets/images/shopping-planner-20-en.png'),
  shopping_50: require('@/assets/images/shopping-planner-50-en.png'),
};

/**
 * 현재 언어에 맞는 뱃지 이미지 반환
 */
function getBadgeImages() {
  const currentLang = i18n.language;
  const isKorean = currentLang?.startsWith('ko');
  return isKorean ? BADGE_IMAGES_KO : BADGE_IMAGES_EN;
}

/**
 * AchievementType에 따른 뱃지 이미지 키 매핑
 */
const ACHIEVEMENT_BADGE_KEY: Record<AchievementType, keyof typeof BADGE_IMAGES_KO> = {
  [AchievementType.STREAK_3_DAYS]: 'streak_3d',
  [AchievementType.STREAK_7_DAYS]: 'streak_7d',
  [AchievementType.STREAK_30_DAYS]: 'streak_30d',
  [AchievementType.CONSUME_10]: 'consume_10',
  [AchievementType.CONSUME_50]: 'consume_50',
  [AchievementType.CONSUME_100]: 'consume_100',
  [AchievementType.REGISTER_FIRST]: 'register_first',
  [AchievementType.REGISTER_10]: 'register_10',
  [AchievementType.REGISTER_50]: 'register_50',
  [AchievementType.REGISTER_100]: 'register_100',
  [AchievementType.SHOPPING_USE_5]: 'shopping_5',
  [AchievementType.SHOPPING_USE_20]: 'shopping_20',
  [AchievementType.SHOPPING_USE_50]: 'shopping_50',
};

/**
 * AchievementType에 따른 현재 언어의 뱃지 이미지 반환
 */
function getBadgeImageForType(type: AchievementType) {
  const images = getBadgeImages();
  const key = ACHIEVEMENT_BADGE_KEY[type];
  return images[key];
}

/**
 * AsyncStorage 키 상수
 */
const ACHIEVEMENTS_KEY = '@achievements';
const STATISTICS_KEY = '@statistics';

/**
 * AchievementType을 번역 키로 매핑
 */
const ACHIEVEMENT_I18N_KEYS: Record<AchievementType, string> = {
  [AchievementType.STREAK_3_DAYS]: 'streak3Days',
  [AchievementType.STREAK_7_DAYS]: 'streak7Days',
  [AchievementType.STREAK_30_DAYS]: 'streak30Days',
  [AchievementType.CONSUME_10]: 'consume10',
  [AchievementType.CONSUME_50]: 'consume50',
  [AchievementType.CONSUME_100]: 'consume100',
  [AchievementType.REGISTER_FIRST]: 'registerFirst',
  [AchievementType.REGISTER_10]: 'register10',
  [AchievementType.REGISTER_50]: 'register50',
  [AchievementType.REGISTER_100]: 'register100',
  [AchievementType.SHOPPING_USE_5]: 'shopping5',
  [AchievementType.SHOPPING_USE_20]: 'shopping20',
  [AchievementType.SHOPPING_USE_50]: 'shopping50',
};

/**
 * 업적 title/description 번역 헬퍼
 */
export function getAchievementTitle(type: AchievementType): string {
  const key = ACHIEVEMENT_I18N_KEYS[type];
  return i18n.t(`achievement.items.${key}.title`);
}

export function getAchievementDescription(type: AchievementType): string {
  const key = ACHIEVEMENT_I18N_KEYS[type];
  return i18n.t(`achievement.items.${key}.description`);
}

/**
 * 기본 업적 목록 생성 함수
 */
function createDefaultAchievements(): Achievement[] {
  const BADGE_IMAGES = getBadgeImages();

  return [
    // 연속 기록
    {
      id: AchievementType.STREAK_3_DAYS,
      type: AchievementType.STREAK_3_DAYS,
      title: getAchievementTitle(AchievementType.STREAK_3_DAYS),
      description: getAchievementDescription(AchievementType.STREAK_3_DAYS),
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
      title: getAchievementTitle(AchievementType.STREAK_7_DAYS),
      description: getAchievementDescription(AchievementType.STREAK_7_DAYS),
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
      title: getAchievementTitle(AchievementType.STREAK_30_DAYS),
      description: getAchievementDescription(AchievementType.STREAK_30_DAYS),
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
      title: getAchievementTitle(AchievementType.CONSUME_10),
      description: getAchievementDescription(AchievementType.CONSUME_10),
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
      title: getAchievementTitle(AchievementType.CONSUME_50),
      description: getAchievementDescription(AchievementType.CONSUME_50),
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
      title: getAchievementTitle(AchievementType.CONSUME_100),
      description: getAchievementDescription(AchievementType.CONSUME_100),
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
      title: getAchievementTitle(AchievementType.REGISTER_FIRST),
      description: getAchievementDescription(AchievementType.REGISTER_FIRST),
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
      title: getAchievementTitle(AchievementType.REGISTER_10),
      description: getAchievementDescription(AchievementType.REGISTER_10),
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
      title: getAchievementTitle(AchievementType.REGISTER_50),
      description: getAchievementDescription(AchievementType.REGISTER_50),
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
      title: getAchievementTitle(AchievementType.REGISTER_100),
      description: getAchievementDescription(AchievementType.REGISTER_100),
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
      title: getAchievementTitle(AchievementType.SHOPPING_USE_5),
      description: getAchievementDescription(AchievementType.SHOPPING_USE_5),
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
      title: getAchievementTitle(AchievementType.SHOPPING_USE_20),
      description: getAchievementDescription(AchievementType.SHOPPING_USE_20),
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
      title: getAchievementTitle(AchievementType.SHOPPING_USE_50),
      description: getAchievementDescription(AchievementType.SHOPPING_USE_50),
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
}

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
        const defaultAchievements = createDefaultAchievements();
        await this.saveAchievements(defaultAchievements);
        return defaultAchievements;
      }
      // 저장된 데이터에 현재 언어의 title/description/badge_image 적용
      const achievements: Achievement[] = JSON.parse(data);
      return achievements.map((achievement) => ({
        ...achievement,
        title: getAchievementTitle(achievement.type),
        description: getAchievementDescription(achievement.type),
        badge_image: getBadgeImageForType(achievement.type),
      }));
    } catch (error) {
      console.error('Error reading achievements:', error);
      return createDefaultAchievements();
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
