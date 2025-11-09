/**
 * Notification Service
 *
 * 유통기한 알림 관련 로직 처리
 */

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ingredientService } from './ingredient.service';
// import { getCalculateDaysRemaining } from '@/utils/time';

const LAST_NOTIFICATION_KEY = '@last_notification_date';
const NOTIFICATION_DAYS_KEY = '@notification_days';
const NOTIFICATION_INTERVAL_KEY = '@notification_interval';

/**
 * 알림 핸들러 설정
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldSetBadge: false,
    shouldPlaySound: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * 알림 주기 저장
 */
export async function saveNotificationDays(days: number): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATION_DAYS_KEY, days.toString());
}

/**
 * 알림 주기 불러오기
 */
export async function getNotificationDays(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(NOTIFICATION_DAYS_KEY);
    return value ? parseInt(value) : 3; // 기본값: 3일
  } catch (error) {
    return 3;
  }
}

/**
 * 최소 알림 간격 저장 (분 단위)
 */
export async function saveNotificationInterval(minutes: number): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATION_INTERVAL_KEY, minutes.toString());
}

/**
 * 최소 알림 간격 불러오기 (분 단위)
 */
export async function getNotificationInterval(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(NOTIFICATION_INTERVAL_KEY);
    return value ? parseInt(value) : 10; // 기본값: 10분
  } catch (error) {
    return 10;
  }
}

/**
 * 마지막 알림 시간 저장
 */
async function saveLastNotificationDate(): Promise<void> {
  const now = new Date().toISOString();
  await AsyncStorage.setItem(LAST_NOTIFICATION_KEY, now);
}

/**
 * 마지막 알림 시간 불러오기
 */
async function getLastNotificationDate(): Promise<Date | null> {
  try {
    const value = await AsyncStorage.getItem(LAST_NOTIFICATION_KEY);
    return value ? new Date(value) : null;
  } catch (error) {
    return null;
  }
}

/**
 * 알림을 보내야 하는지 확인
 */
async function shouldShowNotification(): Promise<boolean> {
  const lastNotification = await getLastNotificationDate();
  if (!lastNotification) return true;

  const now = new Date();
  const diffInMinutes = (now.getTime() - lastNotification.getTime()) / (1000 * 60);

  // 사용자가 설정한 최소 알림 간격 확인
  const notificationInterval = await getNotificationInterval();
  return diffInMinutes >= notificationInterval;
}

/**
 * 유통기한 임박 재료 확인 및 알림 전송
 */
export async function checkExpiryAndNotify(): Promise<void> {
  try {
    // 알림 권한 확인 (Expo Go에서는 에러 발생 가능)
    let settings;
    try {
      settings = await Notifications.getPermissionsAsync();
    } catch (permissionError) {
      console.log('Failed to check notification permissions (expected in Expo Go):', permissionError);
      return;
    }

    if (!(settings as any).granted) {
      return;
    }

    // 최근에 알림을 보냈는지 확인
    const should = await shouldShowNotification();
    if (!should) {
      return;
    }

    // 알림 주기 가져오기
    const notificationDays = await getNotificationDays();

    // 모든 재료 가져오기
    const ingredients = await ingredientService.getIngredients();

    // ===== 프로덕션 로직 (일 단위) - 테스트 후 주석 해제 =====
    // const expiringIngredients = ingredients.filter((ingredient) => {
    //   if (!ingredient.expiry_date) return false;
    //
    //   const daysRemaining = getCalculateDaysRemaining(ingredient.expiry_date);
    //   return daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= notificationDays;
    // });

    // ===== 테스트 로직 (분 단위) - 테스트용 =====
    // 일 단위를 분 단위로 변환: 1일→10분, 3일→30분, 5일→50분, 7일→70분
    const notificationMinutes = notificationDays * 10;

    const expiringIngredients = ingredients.filter((ingredient) => {
      if (!ingredient.expiry_date) return false;

      const now = new Date();
      const expiryDate = new Date(ingredient.expiry_date);
      const diffInMinutes = (expiryDate.getTime() - now.getTime()) / (1000 * 60);

      // 유통기한이 0분 이상 notificationMinutes 이하인 재료만 필터링
      return diffInMinutes >= 0 && diffInMinutes <= notificationMinutes;
    });

    // 임박 재료가 있으면 알림 전송
    if (expiringIngredients.length > 0) {
      const message =
        expiringIngredients.length === 1
          ? `${expiringIngredients[0].name}의 유통기한이 끝나가요.`
          : `${expiringIngredients.length}개 품목의 유통기한이 끝나가요.`;

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '유통기한 알림',
            body: message,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: null, // 즉시 전송
        });

        // 마지막 알림 시간 저장
        await saveLastNotificationDate();
      } catch (notificationError) {
        console.log('Failed to send notification (expected in Expo Go):', notificationError);
      }
    }
  } catch (error) {
    console.error('Error checking expiry and notifying:', error);
  }
}
