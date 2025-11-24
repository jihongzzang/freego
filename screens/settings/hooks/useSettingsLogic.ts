import { useEffect, useState, useCallback, useRef } from 'react';
import { Platform, Linking, AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/lib/theme';
import { useDialog } from '@/contexts/DialogContext';
import { useMVIStore } from '@/mvi/base';
import { createSettingsStore } from '@/mvi/features/settings';
import { useToast } from '@/components/ui';

export function useSettingsLogic() {
  const { t } = useTranslation();
  const { isDark, themePreference, setTheme } = useTheme();
  const { alert, confirm } = useDialog();
  const { showToast } = useToast();

  // MVI Store
  const [state, dispatch, effect] = useMVIStore(createSettingsStore);
  const { notificationDays } = state;

  // Notification permission state
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const appState = useRef(AppState.currentState);

  // Load notification days on mount
  useEffect(() => {
    dispatch({ type: 'LOAD_NOTIFICATION_DAYS' });
  }, [dispatch]);

  // Check notification permission on every screen focus
  useFocusEffect(
    useCallback(() => {
      checkNotificationPermission();
    }, []),
  );

  // Check notification permission when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to foreground
        checkNotificationPermission();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

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
      const granted = (settings as any).granted;

      // 권한 상태가 변경되었을 때만 알림 체크 로직 실행
      if (hasNotificationPermission !== granted) {
        setHasNotificationPermission(granted);

        // 권한이 허용되었을 때만 알림 스케줄링
        if (granted) {
          const { checkExpiryAndNotify } = await import('@/services/notification.service');
          await checkExpiryAndNotify();
        }
      }
    } catch (error) {
      // console.log('Failed to check notification permission (expected in Expo Go):', error);
      setHasNotificationPermission(false);
    }
  }

  async function requestNotificationPermission() {
    try {
      const settings = await Notifications.requestPermissionsAsync();
      const granted = (settings as any).granted;
      setHasNotificationPermission(granted);

      if (granted) {
        // 권한 허용 시 즉시 알림 스케줄링
        const { checkExpiryAndNotify } = await import('@/services/notification.service');
        await checkExpiryAndNotify();
      } else {
        confirm({
          title: t('settings.messages.permissionRequiredTitle'),
          message: t('settings.messages.permissionRequiredMessage'),
          confirmText: t('settings.messages.openSettings'),
          cancelText: t('common.cancel'),
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
        message: t('settings.messages.permissionRequestFailed'),
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
    const email = 'jujihong2@gmail.com';
    const subject = t('settings.feedback.emailSubject');
    const body = t('settings.feedback.emailBody');

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      showToast({
        message: t('settings.messages.emailAppOpenFailed'),
        type: 'error',
      });
    }
  }

  function handleDeleteAllData() {
    confirm({
      title: t('settings.messages.deleteDataTitle'),
      message: t('settings.messages.deleteDataConfirm'),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      isDestructive: true,
      onConfirm: async () => {
        dispatch({ type: 'DELETE_ALL_DATA' });
      },
    });
  }

  function openPrivacyPolicy() {
    dispatch({ type: 'OPEN_PRIVACY_POLICY' });
  }

  function openTermsOfService() {
    dispatch({ type: 'OPEN_TERMS_OF_SERVICE' });
  }

  function rateApp() {
    dispatch({ type: 'RATE_APP' });
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
    openPrivacyPolicy,
    openTermsOfService,
    rateApp,
  };
}
