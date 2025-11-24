import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/lib/theme';
import { Achievement } from '@/data/models/achievement.model';
import { Button, Chip } from './ui';
import { useTranslation } from 'react-i18next';

interface AchievementCardProps {
  achievement: Achievement;
  onClaimBadge?: (achievement: Achievement) => void;
  onViewBadge?: (achievement: Achievement) => void;
}

export default function AchievementCard({ achievement, onClaimBadge, onViewBadge }: AchievementCardProps) {
  const { t } = useTranslation();
  const { colors, typography, spacing, borderRadius, isDark } = useTheme();

  const progress = achievement.target > 0 ? (achievement.current / achievement.target) * 100 : 0;
  const progressClamped = Math.min(progress, 100);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? colors.grey900 : colors.white,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          opacity: achievement.completed ? 1 : 0.7,
        },
      ]}
    >
      {/* 아이콘 & 타이틀 */}
      <View style={styles.header}>
        <Text style={styles.icon}>{achievement.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              typography.styles.t4Semibold,
              {
                color: achievement.completed ? colors.primary : colors.text,
              },
            ]}
          >
            {achievement.title}
          </Text>
          <Text
            style={[
              typography.styles.t7,
              {
                color: colors.textSecondary,
                marginTop: spacing.xs,
              },
            ]}
          >
            {achievement.description}
          </Text>
        </View>
        {achievement.completed && achievement.claimed && <Chip label={t('common.completed')} variant="secondary" size="xlarge" />}
        {achievement.completed && !achievement.claimed && (
          <Button size="small" onPress={() => onClaimBadge?.(achievement)}>
            <Text style={[typography.styles.t7Semibold, { color: colors.white }]}>{t('achievement.claimBadge')}</Text>
          </Button>
        )}
      </View>

      {/* 진행률 바 */}
      {!achievement.completed && (
        <View style={{ marginTop: spacing.md }}>
          <View
            style={[
              styles.progressBar,
              {
                backgroundColor: isDark ? colors.grey800 : colors.grey200,
                borderRadius: borderRadius.full,
                height: 8,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  borderRadius: borderRadius.full,
                  width: `${progressClamped}%`,
                },
              ]}
            />
          </View>
          <Text
            style={[
              typography.styles.t7,
              {
                color: colors.textSecondary,
                marginTop: spacing.xs,
              },
            ]}
          >
            {achievement.current} / {achievement.target}
          </Text>
        </View>
      )}

      {/* 뱃지 보기 버튼 */}
      {achievement.completed && achievement.claimed && onViewBadge && (
        <Button
          size="medium"
          variant="primary"
          style={{ marginTop: spacing.md }}
          // style={[
          //   styles.viewBadgeButton,
          //   {
          //     backgroundColor: isDark ? colors.grey800 : colors.grey100,
          //     borderRadius: borderRadius.md,
          //     paddingHorizontal: spacing.md,
          //     paddingVertical: spacing.sm,
          //     marginTop: spacing.md,
          //     alignItems: 'center',
          //   },
          // ]}
          onPress={() => onViewBadge(achievement)}
        >
          <Text style={[typography.styles.t5Semibold, { color: colors.white }]}>{t('achievement.viewBadge')}</Text>
        </Button>
      )}

      {/* 완료 날짜 */}
      {achievement.completed && achievement.completed_date_time && (
        <Text
          style={[
            typography.styles.t7,
            {
              color: colors.textTertiary,
              marginTop: spacing.sm,
            },
          ]}
        >
          {new Date(achievement.completed_date_time).toLocaleDateString()} {t('common.achieved')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  icon: {
    fontSize: 32,
  },
  badge: {
    alignSelf: 'flex-start',
  },
  claimButton: {
    alignSelf: 'flex-start',
  },
  viewBadgeButton: {
    width: '100%',
  },
  progressBar: {
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});
