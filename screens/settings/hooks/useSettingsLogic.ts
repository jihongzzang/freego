import { useEffect, useState } from 'react';
import { Platform, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useTheme } from '@/lib/theme';
import { useDialog } from '@/contexts/DialogContext';
import { useMVIStore } from '@/mvi/base';
import { createSettingsStore } from '@/mvi/features/settings';
import { useToast } from '@/components/ui';
import ERROR_MESSAGES from '@/constants/toast/errorMessages';

export function useSettingsLogic() {
  const { isDark, themePreference, setTheme } = useTheme();
  const { alert, confirm } = useDialog();
  const { showToast } = useToast();

  // MVI Store
  const [state, dispatch, effect] = useMVIStore(createSettingsStore);
  const { notificationDays } = state;

  // Notification permission state
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);

  // Load notification days and check permission on mount
  useEffect(() => {
    dispatch({ type: 'LOAD_NOTIFICATION_DAYS' });
    checkNotificationPermission();
  }, [dispatch]);

  // Handle effects
  useEffect(() => {
    if (effect) {
      switch (effect.type) {
        case 'SHOW_TOAST':
          showToast({
            message: effect.payload.message,
            type: effect.payload.variant,
          });
          break;
      }
    }
  }, [effect, showToast]);

  async function checkNotificationPermission() {
    try {
      const settings = await Notifications.getPermissionsAsync();
      setHasNotificationPermission((settings as any).granted);
    } catch (error) {
      // console.log('Failed to check notification permission (expected in Expo Go):', error);
      setHasNotificationPermission(false);
    }
  }

  async function requestNotificationPermission() {
    try {
      const settings = await Notifications.requestPermissionsAsync();
      setHasNotificationPermission((settings as any).granted);

      if (!(settings as any).granted) {
        confirm({
          title: '알림 권한 필요',
          message: '설정에서 알림 권한을 허용해주세요.',
          confirmText: '설정 열기',
          cancelText: '취소',
          onConfirm: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          },
        });
      }
    } catch (error) {
      // console.log('Failed to request notification permission (expected in Expo Go):', error);
      showToast({
        message: 'Expo Go에서는 알림 권한을 요청할 수 없어요. Development build를 사용해주세요.',
        type: 'warning',
      });
    }
  }

  function updateNotificationDays(days: number) {
    dispatch({ type: 'SET_NOTIFICATION_DAYS', payload: days });
  }

  function toggleTheme() {
    const newMode = isDark ? 'light' : 'dark';
    setTheme(newMode);
  }

  function resetThemeToSystem() {
    setTheme('system');
  }

  async function sendFeedback() {
    const email = 'support@fridge.app';
    const subject = '냉장고 관리 앱 피드백';
    const body = '안녕하세요,\n\n피드백 내용을 입력해주세요:\n\n';

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      showToast({
        message: ERROR_MESSAGES.ERROR_EMAIL_APP_OPEN_FAILED,
        type: 'error',
      });
    }
  }

  function handleDeleteAllData() {
    confirm({
      title: '데이터 삭제',
      message: '등록된 모든 냉장고 재료가 삭제돼요.\n이 작업은 되돌릴 수 없어요.\n\n정말 삭제하시겠어요?',
      confirmText: '삭제',
      cancelText: '취소',
      isDestructive: true,
      onConfirm: async () => {
        dispatch({ type: 'DELETE_ALL_DATA' });
      },
    });
  }

  return {
    isDark,
    themePreference,
    notificationDays,
    hasNotificationPermission,
    requestNotificationPermission,
    updateNotificationDays,
    toggleTheme,
    resetThemeToSystem,
    sendFeedback,
    handleDeleteAllData,
  };
}
