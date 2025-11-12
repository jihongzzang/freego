import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 알림 설정 관련 상수
 */
const LAST_NOTIFICATION_KEY = '@last_notification_date';
const NOTIFICATION_DAYS_KEY = '@notification_days';
const NOTIFICATION_INTERVAL_KEY = '@notification_interval';

/**
 * 알림 데이터 접근 레포지토리
 * AsyncStorage와의 상호작용만 담당
 */
export const notificationRepository = {
  /**
   * 알림 주기 저장 (일 단위)
   */
  async saveNotificationDays(days: number): Promise<void> {
    await AsyncStorage.setItem(NOTIFICATION_DAYS_KEY, days.toString());
  },

  /**
   * 알림 주기 불러오기 (일 단위)
   */
  async getNotificationDays(): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(NOTIFICATION_DAYS_KEY);
      return value ? parseInt(value) : 3; // 기본값: 3일
    } catch (error) {
      return 3;
    }
  },

  /**
   * 최소 알림 간격 저장 (분 단위)
   */
  async saveNotificationInterval(minutes: number): Promise<void> {
    await AsyncStorage.setItem(NOTIFICATION_INTERVAL_KEY, minutes.toString());
  },

  /**
   * 최소 알림 간격 불러오기 (분 단위)
   */
  async getNotificationInterval(): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(NOTIFICATION_INTERVAL_KEY);
      return value ? parseInt(value) : 10; // 기본값: 10분
    } catch (error) {
      return 10;
    }
  },

  /**
   * 마지막 알림 시간 저장
   */
  async saveLastNotificationDate(): Promise<void> {
    const now = new Date().toISOString();
    await AsyncStorage.setItem(LAST_NOTIFICATION_KEY, now);
  },

  /**
   * 마지막 알림 시간 불러오기
   */
  async getLastNotificationDate(): Promise<Date | null> {
    try {
      const value = await AsyncStorage.getItem(LAST_NOTIFICATION_KEY);
      return value ? new Date(value) : null;
    } catch (error) {
      return null;
    }
  },
};
