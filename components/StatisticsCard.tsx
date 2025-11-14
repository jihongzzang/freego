import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';
import { Statistics } from '@/data/models/achievement.model';

interface StatisticsCardProps {
  statistics: Statistics;
}

export default function StatisticsCard({ statistics }: StatisticsCardProps) {
  const { colors, typography, spacing, borderRadius, isDark } = useTheme();

  const stats = [
    {
      label: '총 등록',
      value: statistics.total_registered,
      icon: '📦',
    },
    {
      label: '총 소비',
      value: statistics.total_consumed,
      icon: '✅',
    },
    {
      label: '장보기',
      value: statistics.total_shopping_completed,
      icon: '🛒',
    },
    {
      label: '현재 연속',
      value: `${statistics.streak_record.current_streak}일`,
      icon: '🔥',
    },
    {
      label: '최장 연속',
      value: `${statistics.streak_record.longest_streak}일`,
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
      <Text style={[typography.styles.t3Semibold, { color: colors.text, marginBottom: spacing.md }]}>나의 통계</Text>

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
