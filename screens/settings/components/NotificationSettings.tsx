import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, BellOff } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Card from '@/components/ui/Card';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface NotificationSettingsProps {
  hasPermission: boolean;
  notificationDays: number;
  onRequestPermission: () => void;
  onUpdateDays: (days: number) => void;
}

export function NotificationSettings({
  hasPermission,
  notificationDays,
  onRequestPermission,
  onUpdateDays,
}: NotificationSettingsProps) {
  const { t } = useTranslation();
  const { colors, typography, spacing, borderRadius, isDark } = useTheme();

  const styles = useMemo(() => createStyles({ spacing, borderRadius }), [spacing, borderRadius]);

  if (!hasPermission) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Bell size={20} color={colors.textSecondary} />
          <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>{t('settings.notification.title')}</Text>
        </View>

        <Card variant="elevated" padding="large">
          <View style={styles.permissionContent}>
            <BellOff size={40} color={colors.textTertiary} />
            <Text style={[typography.styles.t5Semibold, { color: colors.text, marginTop: spacing.md }]}>
              {t('settings.notification.permissionRequired')}
            </Text>
            <Text
              style={[
                typography.styles.t7,
                {
                  color: colors.textSecondary,
                  textAlign: 'center',
                  marginTop: spacing.xs,
                },
              ]}
            >
              {t('settings.notification.permissionDescription')}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={onRequestPermission}
            activeOpacity={0.7}
          >
            <Bell size={20} color={colors.white} />
            <Text style={[typography.styles.t5Semibold, { color: colors.white }]}>{t('settings.notification.allowPermission')}</Text>
          </TouchableOpacity>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Bell size={20} color={colors.textSecondary} />
        <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>{t('settings.notification.title')}</Text>
      </View>

      <Card variant="elevated" padding="large">
        <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>{t('settings.notification.expiryPeriod')}</Text>
        <Text style={[typography.styles.t7, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          {t('settings.notification.expiryDescription')}
        </Text>

        <View style={styles.notificationOptions}>
          {[1, 2, 3, 5, 7].map((days) => (
            <TouchableOpacity
              key={days}
              style={[
                styles.notificationOption,
                {
                  backgroundColor: isDark ? colors.grey800 : colors.grey100,
                  borderColor: isDark ? colors.grey800 : colors.grey100,
                },
                notificationDays === days && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => onUpdateDays(days)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  typography.styles.t6Medium,
                  { color: colors.textSecondary },
                  notificationDays === days && {
                    color: colors.white,
                  },
                ]}
              >
                {t('common.days', { count: days })}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
    </View>
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
    section: {
      marginBottom: spacing.xxl,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
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
      borderRadius: borderRadius.xl,
      marginTop: spacing.lg,
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
    },
  });
