import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Animated,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Moon,
  Sun,
  Info,
  MessageSquare,
  BellOff,
} from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import { useTheme } from '@/lib/theme';
import { useDialog } from '@/hooks/useDialog';
import { useMVIStore } from '@/mvi/base';
import { createSettingsStore } from '@/mvi/features/settings';
import Header from '@/components/Header';

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1 }}>
      <SettingsContent />
    </View>
  );
}

function SettingsContent() {
  const {
    colors,
    typography,
    spacing,
    borderRadius,
    isDark,
    themePreference,
    setTheme,
  } = useTheme();
  const { alert, confirm, DialogComponent } = useDialog();

  // MVI Store 사용
  const [state, dispatch, effect] = useMVIStore(createSettingsStore);
  const { notificationDays } = state;

  // 알림 권한 상태
  const [hasNotificationPermission, setHasNotificationPermission] =
    useState(false);

  // 알림 권한 확인
  useEffect(() => {
    checkNotificationPermission();
  }, []);

  async function checkNotificationPermission() {
    const settings = await Notifications.getPermissionsAsync();
    setHasNotificationPermission((settings as any).granted);
  }

  async function requestNotificationPermission() {
    const settings = await Notifications.requestPermissionsAsync();
    setHasNotificationPermission((settings as any).granted);

    if (!(settings as any).granted) {
      Alert.alert('알림 권한 필요', '설정에서 알림 권한을 허용해주세요.', [
        { text: '취소', style: 'cancel' },
        {
          text: '설정 열기',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          },
        },
      ]);
    }
  }

  const styles = useMemo(
    () => createStyles({ spacing, borderRadius }),
    [spacing, borderRadius]
  );

  // Effect 처리
  useEffect(() => {
    if (effect) {
      switch (effect.type) {
        case 'SHOW_ALERT':
          alert(
            effect.payload.title,
            effect.payload.message,
            effect.payload.type
          );
          break;
      }
    }
  }, [effect, alert]);

  function updateNotificationDays(days: number) {
    dispatch({ type: 'SET_NOTIFICATION_DAYS', payload: days });
  }

  async function toggleTheme() {
    const newMode = isDark ? 'light' : 'dark';
    await setTheme(newMode);
  }

  async function resetThemeToSystem() {
    await setTheme('system');
    alert('성공', '시스템 설정을 따릅니다.', 'success');
  }

  async function sendFeedback() {
    const email = 'support@fridge.app';
    const subject = '냉장고 관리 앱 피드백';
    const body = '안녕하세요,\n\n피드백 내용을 입력해주세요:\n\n';

    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      alert('오류', '이메일 앱을 열 수 없습니다.', 'error');
    }
  }

  return (
    <>
      <DialogComponent />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="설정" />

        <Animated.ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell size={20} color={colors.primary} />
              <Text style={[typography.styles.h5, { color: colors.text }]}>
                알림 설정
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              {hasNotificationPermission ? (
                <>
                  <Text
                    style={[
                      typography.styles.bodySemibold,
                      { color: colors.text },
                    ]}
                  >
                    유통기한 알림 주기
                  </Text>
                  <Text
                    style={[
                      typography.styles.bodySmall,
                      { color: colors.textSecondary },
                    ]}
                  >
                    유통기한 며칠 전부터 알림을 받을지 선택하세요
                  </Text>

                  <View style={styles.notificationOptions}>
                    {[1, 2, 3, 5, 7].map((days) => (
                      <TouchableOpacity
                        key={days}
                        style={[
                          styles.notificationOption,
                          {
                            backgroundColor: colors.surfaceSecondary,
                            borderColor: colors.border,
                          },
                          notificationDays === days && {
                            backgroundColor: colors.primaryLight,
                            borderColor: colors.primary,
                          },
                        ]}
                        onPress={() => updateNotificationDays(days)}
                      >
                        <Text
                          style={[
                            typography.styles.label,
                            { color: colors.textSecondary },
                            notificationDays === days && {
                              color: colors.primary,
                            },
                          ]}
                        >
                          {days}일
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.permissionContent}>
                    <BellOff size={40} color={colors.textTertiary} />
                    <Text
                      style={[
                        typography.styles.bodySemibold,
                        { color: colors.text, marginTop: spacing.md },
                      ]}
                    >
                      알림 권한이 필요합니다
                    </Text>
                    <Text
                      style={[
                        typography.styles.bodySmall,
                        {
                          color: colors.textSecondary,
                          textAlign: 'center',
                          marginTop: spacing.xs,
                        },
                      ]}
                    >
                      유통기한 알림을 받으려면{'\n'}알림 권한을 허용해주세요
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.permissionButton,
                      { backgroundColor: colors.primaryLight },
                    ]}
                    onPress={requestNotificationPermission}
                  >
                    <Bell size={20} color={colors.primary} />
                    <Text
                      style={[
                        typography.styles.bodySemibold,
                        { color: colors.primary },
                      ]}
                    >
                      알림 권한 허용하기
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              {isDark ? (
                <Moon size={20} color={colors.primary} />
              ) : (
                <Sun size={20} color={colors.primary} />
              )}
              <Text style={[typography.styles.h5, { color: colors.text }]}>
                테마
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      typography.styles.bodySemibold,
                      { color: colors.text },
                    ]}
                  >
                    다크 모드
                  </Text>
                  <Text
                    style={[
                      typography.styles.bodySmall,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {themePreference === 'system'
                      ? '시스템 설정 따름'
                      : '어두운 테마 사용'}
                  </Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{
                    false: colors.surfaceSecondary,
                    true: colors.primaryLight,
                  }}
                  thumbColor={isDark ? colors.primary : colors.textTertiary}
                />
              </View>
              {themePreference !== 'system' && (
                <TouchableOpacity
                  style={[
                    styles.settingRow,
                    styles.systemResetButton,
                    { borderTopColor: colors.border },
                  ]}
                  onPress={resetThemeToSystem}
                >
                  <Text
                    style={[typography.styles.label, { color: colors.primary }]}
                  >
                    시스템 설정으로 되돌리기
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MessageSquare size={20} color={colors.primary} />
              <Text style={[typography.styles.h5, { color: colors.text }]}>
                개발자에게 피드백
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <TouchableOpacity
                style={styles.feedbackButton}
                onPress={sendFeedback}
              >
                <MessageSquare size={20} color={colors.primary} />
                <Text
                  style={[
                    typography.styles.bodySemibold,
                    { color: colors.text },
                  ]}
                >
                  의견 보내기
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info size={20} color={colors.primary} />
              <Text style={[typography.styles.h5, { color: colors.text }]}>
                앱 정보
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.infoRow}>
                <Text
                  style={[
                    typography.styles.bodySmall,
                    { color: colors.textSecondary },
                  ]}
                >
                  버전
                </Text>
                <Text style={[typography.styles.label, { color: colors.text }]}>
                  1.0.0
                </Text>
              </View>
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <View style={styles.infoRow}>
                <Text
                  style={[
                    typography.styles.bodySmall,
                    { color: colors.textSecondary },
                  ]}
                >
                  개발자
                </Text>
                <Text style={[typography.styles.label, { color: colors.text }]}>
                  냉장고 관리 팀
                </Text>
              </View>
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <View style={styles.infoRow}>
                <Text
                  style={[
                    typography.styles.bodySmall,
                    { color: colors.textSecondary },
                  ]}
                >
                  문의
                </Text>
                <Text style={[typography.styles.label, { color: colors.text }]}>
                  support@fridge.app
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text
              style={[
                typography.styles.bodySemibold,
                { color: colors.textSecondary },
              ]}
            >
              냉장고 재고관리 앱
            </Text>
            <Text
              style={[
                typography.styles.caption,
                { color: colors.textTertiary },
              ]}
            >
              음식물 쓰레기를 줄이고 현명한 소비를
            </Text>
          </View>
        </Animated.ScrollView>
      </View>
    </>
  );
}

const createStyles = ({
  spacing,
  borderRadius,
}: {
  spacing: typeof import('@/lib/theme').spacing;
  borderRadius: typeof import('@/lib/theme').borderRadius;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    section: {
      paddingHorizontal: spacing.xl,
      marginTop: spacing.xxl,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    card: {
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
    },
    notificationOptions: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.lg,
    },
    notificationOption: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    permissionContent: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    permissionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.lg,
      borderRadius: borderRadius.md,
      marginTop: spacing.lg,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    settingInfo: {
      flex: 1,
    },
    feedbackButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.lg,
      borderRadius: borderRadius.md,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
    },
    divider: {
      height: 1,
    },
    footer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    systemResetButton: {
      paddingVertical: spacing.md,
      justifyContent: 'center',
      borderTopWidth: 1,
    },
  });
