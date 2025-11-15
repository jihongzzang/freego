/**
 * Notification Service
 *
 * 유통기한 알림 관련 로직 처리
 */

import * as Notifications from 'expo-notifications';
import { ingredientRepository } from '@/data/repositories/ingredient.repository';
import { notificationRepository } from '@/data/repositories/notification.repository';
import { getCalculateDaysRemaining } from '@/utils/time';

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
  await notificationRepository.saveNotificationDays(days);
  // 설정 변경 후 새로운 주기에 맞춰 알림 재스케줄링
  await checkExpiryAndNotify();
}

/**
 * 알림 주기 불러오기
 */
export async function getNotificationDays(): Promise<number> {
  return notificationRepository.getNotificationDays();
}

/**
 * 최소 알림 간격 저장 (분 단위)
 */
export async function saveNotificationInterval(minutes: number): Promise<void> {
  await notificationRepository.saveNotificationInterval(minutes);
}

/**
 * 최소 알림 간격 불러오기 (분 단위)
 */
export async function getNotificationInterval(): Promise<number> {
  return notificationRepository.getNotificationInterval();
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
      return;
    }

    if (!(settings as any).granted) {
      return;
    }

    // 알림 주기 가져오기
    const notificationDays = await getNotificationDays();

    // 모든 재료 가져오기
    const ingredients = await ingredientRepository.getIngredients();

    const expiringIngredients = ingredients.filter((ingredient) => {
      if (!ingredient.expired_date_time) return false;

      const daysRemaining = getCalculateDaysRemaining(ingredient.expired_date_time);
      return daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= notificationDays;
    });

    // 기존 알림 모두 취소 (중복 방지)
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (cancelError) {
      //
    }

    if (expiringIngredients.length > 0) {
      const message =
        expiringIngredients.length === 1
          ? expiringIngredients[0].emoji
            ? `${expiringIngredients[0].emoji + expiringIngredients[0].name}의 유통기한이 끝나가요.`
            : `${expiringIngredients[0].name}의 유통기한이 끝나가요.`
          : `${expiringIngredients.length}개 품목의 유통기한이 끝나가요.`;

      // 알림 전송 시간 결정
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      let triggerDate = new Date();

      // 0시 ~ 8시 29분: 오늘 8시 30분에 전송
      if (currentHour < 8 || (currentHour === 8 && currentMinute < 30)) {
        triggerDate.setHours(8, 30, 0, 0);
      }
      // 8시 30분 ~ 17시: 오늘 17시에 전송
      else if (currentHour < 17) {
        triggerDate.setHours(17, 0, 0, 0);
      }
      // 17시 ~ 24시: 내일 8시 30분에 전송
      else {
        triggerDate.setDate(triggerDate.getDate() + 1);
        triggerDate.setHours(8, 30, 0, 0);
      }

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '유통기한 알림',
            body: message,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
        });
      } catch (notificationError) {
        //
      }
    }
  } catch (error) {
    //
  }
}
