/**
 * Notification Service
 *
 * 유통기한 알림 관련 로직 처리
 */

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ingredientService } from './ingredient.service';
import { getCalculateDaysRemaining } from '@/utils/time';

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
  console.log('[Notification] 마지막 알림 시간:', lastNotification);
  if (!lastNotification) {
    console.log('[Notification] 마지막 알림 기록 없음 - 알림 전송 가능');
    return true;
  }

  const now = new Date();
  const diffInMinutes = (now.getTime() - lastNotification.getTime()) / (1000 * 60);
  console.log('[Notification] 마지막 알림으로부터 경과 시간(분):', diffInMinutes.toFixed(2));

  // 사용자가 설정한 최소 알림 간격 확인
  const notificationInterval = await getNotificationInterval();
  console.log('[Notification] 최소 알림 간격(분):', notificationInterval);
  const canSend = diffInMinutes >= notificationInterval;
  console.log('[Notification] 알림 전송 가능:', canSend);
  return canSend;
}

/**
 * 유통기한 임박 재료 확인 및 알림 전송
 */
export async function checkExpiryAndNotify(): Promise<void> {
  console.log('[Notification] checkExpiryAndNotify 시작');
  try {
    // 알림 권한 확인 (Expo Go에서는 에러 발생 가능)
    let settings;
    try {
      settings = await Notifications.getPermissionsAsync();
      console.log('[Notification] 권한 확인 결과:', settings);
    } catch (permissionError) {
      console.log('Failed to check notification permissions (expected in Expo Go):', permissionError);
      return;
    }

    if (!(settings as any).granted) {
      console.log('[Notification] 권한이 없어 종료');
      return;
    }

    // 최근에 알림을 보냈는지 확인
    const should = await shouldShowNotification();
    console.log('[Notification] 알림 전송 가능 여부:', should);

    if (!should) {
      console.log('[Notification] 최소 알림 간격이 지나지 않아 종료');
      return;
    }

    // 알림 주기 가져오기
    const notificationDays = await getNotificationDays();
    console.log('[Notification] 알림 주기 (일):', notificationDays);

    // 모든 재료 가져오기
    const ingredients = await ingredientService.getIngredients();
    console.log('[Notification] 전체 재료 개수:', ingredients.length);

    // ===== 프로덕션 로직 (일 단위) - 테스트 후 주석 해제 =====
    const expiringIngredients = ingredients.filter((ingredient) => {
      if (!ingredient.expiry_date) return false;

      const daysRemaining = getCalculateDaysRemaining(ingredient.expiry_date);
      return daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= notificationDays;
    });

    console.log('[Notification] 임박한 재료 개수:', expiringIngredients.length);

    if (expiringIngredients.length > 0) {
      console.log(
        '[Notification] 임박한 재료 목록:',
        expiringIngredients.map((i) => i.name),
      );
    }

    if (expiringIngredients.length > 0) {
      const message =
        expiringIngredients.length === 1
          ? expiringIngredients[0].emoji
            ? `${expiringIngredients[0].emoji + expiringIngredients[0].name}의 유통기한이 끝나가요.`
            : `${expiringIngredients[0].name}의 유통기한이 끝나가요.`
          : `${expiringIngredients.length}개 품목의 유통기한이 끝나가요.`;

      console.log('[Notification] 알림 메시지:', message);

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

        console.log('[Notification] 알림 전송 성공');
        // 마지막 알림 시간 저장
        await saveLastNotificationDate();
      } catch (notificationError) {
        console.log('Failed to send notification (expected in Expo Go):', notificationError);
      }
    } else {
      console.log('[Notification] 임박한 재료가 없어 알림 전송 안함');
    }
  } catch (error) {
    console.error('Error checking expiry and notifying:', error);
  }
}
