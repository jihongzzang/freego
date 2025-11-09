import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, BellOff } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Card from '@/components/ui/Card';
import { useMemo } from 'react';

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
  const { colors, typography, spacing, borderRadius, isDark } = useTheme();

  const styles = useMemo(() => createStyles({ spacing, borderRadius }), [spacing, borderRadius]);

  if (!hasPermission) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Bell size={20} color={colors.textSecondary} />
          <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>알림 설정</Text>
        </View>

        <Card variant="elevated" padding="large">
          <View style={styles.permissionContent}>
            <BellOff size={40} color={colors.textTertiary} />
            <Text style={[typography.styles.t5Semibold, { color: colors.text, marginTop: spacing.md }]}>
              알림 권한이 필요해요
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
              유통기한 알림을 받으려면{'\n'}알림 권한을 허용해주세요
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={onRequestPermission}
            activeOpacity={0.7}
          >
            <Bell size={20} color={colors.white} />
            <Text style={[typography.styles.t5Semibold, { color: colors.white }]}>알림 권한 허용하기</Text>
          </TouchableOpacity>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Bell size={20} color={colors.textSecondary} />
        <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>알림 설정</Text>
      </View>

      <Card variant="elevated" padding="large">
        <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>유통기한 알림 주기</Text>
        <Text style={[typography.styles.t7, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          유통기한 며칠 전부터 알림을 받을지 선택하세요
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
                {days}일
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
