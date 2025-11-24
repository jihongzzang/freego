import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';
import { Statistics } from '@/data/models/achievement.model';
import { useTranslation } from 'react-i18next';

interface StatisticsCardProps {
  statistics: Statistics;
}

export default function StatisticsCard({ statistics }: StatisticsCardProps) {
  const { t } = useTranslation();
  const { colors, typography, spacing, borderRadius, isDark } = useTheme();

  const stats = [
    {
      label: t('achievement.statistics.totalRegistered'),
      value: statistics.total_registered,
      icon: '📦',
    },
    {
      label: t('achievement.statistics.totalConsumed'),
      value: statistics.total_consumed,
      icon: '✅',
    },
    {
      label: t('achievement.statistics.shopping'),
      value: statistics.total_shopping_completed,
      icon: '🛒',
    },
    {
      label: t('achievement.statistics.currentStreak'),
      value: t('common.days', { count: statistics.streak_record.current_streak }),
      icon: '🔥',
    },
    {
      label: t('achievement.statistics.longestStreak'),
      value: t('common.days', { count: statistics.streak_record.longest_streak }),
      icon: '👑',
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.grey900 : colors.white,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
        },
      ]}
    >
      <Text style={[typography.styles.t3Semibold, { color: colors.text, marginBottom: spacing.md }]}>{t('achievement.statistics.title')}</Text>

      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <View
            key={index}
            style={[
              styles.statItem,
              {
                backgroundColor: isDark ? colors.grey800 : colors.grey100,
                borderRadius: borderRadius.md,
                padding: spacing.md,
              },
            ]}
          >
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={[typography.styles.t7, { color: colors.textSecondary, marginTop: spacing.xs }]}>
              {stat.label}
            </Text>
            <Text
              style={[
                typography.styles.t3Semibold,
                {
                  color: colors.text,
                  marginTop: spacing.xs,
                },
              ]}
            >
              {stat.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
  },
});
