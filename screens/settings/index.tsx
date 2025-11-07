import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '@/lib/theme';
import Header from '@/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingsLogic } from './hooks/useSettingsLogic';
import { NotificationSettings } from './components/NotificationSettings';
import { ThemeSettings } from './components/ThemeSettings';
import { DataManagement } from './components/DataManagement';
import { FeedbackSection } from './components/FeedbackSection';
import { AppInfo } from './components/AppInfo';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, typography, spacing } = useTheme();

  const {
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
  } = useSettingsLogic();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="더보기" />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
        }}
      >
        <NotificationSettings
          hasPermission={hasNotificationPermission}
          notificationDays={notificationDays}
          onRequestPermission={requestNotificationPermission}
          onUpdateDays={updateNotificationDays}
        />

        <ThemeSettings
          isDark={isDark}
          themePreference={themePreference}
          onToggleTheme={toggleTheme}
          onResetToSystem={resetThemeToSystem}
        />

        <DataManagement onDeleteAllData={handleDeleteAllData} />

        <FeedbackSection onSendFeedback={sendFeedback} />

        <AppInfo />

        <View style={styles.footer}>
          <Text style={[typography.styles.t5Semibold, { color: colors.textSecondary }]}>프리고 앱</Text>
          <Text style={[typography.styles.t7, { color: colors.textTertiary, marginTop: spacing.xs }]}>
            음식물 쓰레기를 줄이고 현명한 소비를
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    footer: {
      alignItems: 'center',
      // paddingVertical: spacing.xxl * 2,
    },
  });
