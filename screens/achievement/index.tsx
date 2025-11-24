import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTheme } from '@/lib/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Achievement } from '@/data/models/achievement.model';
import { createAchievementStore, AchievementState } from '@/mvi/features/achievement';
import Header, { HEADER_HEIGHT } from '@/components/ui/Header';
import AchievementCard from '@/components/AchievementCard';
import StatisticsCard from '@/components/StatisticsCard';
import BadgeModal from '@/components/BadgeModal';
import { useTranslation } from 'react-i18next';

export default function AchievementScreen() {
  const { t } = useTranslation();
  const { colors, spacing, typography } = useTheme();
  const insets = useSafeAreaInsets();

  const [store] = useState(() => createAchievementStore());
  const [state, setState] = useState<AchievementState>(store.getState());
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  // Store 구독
  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, [store]);

  // 화면 포커스 시 데이터 갱신
  useFocusEffect(
    useCallback(() => {
      store.dispatch({ type: 'REFRESH_ACHIEVEMENTS' });
    }, [store]),
  );

  // 뱃지 받기 핸들러
  const handleClaimBadge = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowBadgeModal(true);

    // 뱃지 claimed 처리
    store.dispatch({
      type: 'CLAIM_BADGE',
      payload: { achievementId: achievement.id },
    });
  };

  // 뱃지 보기 핸들러
  const handleViewBadge = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowBadgeModal(true);
  };

  const handleCloseBadgeModal = () => {
    setShowBadgeModal(false);
    setTimeout(() => {
      setSelectedAchievement(null);
    }, 300);
  };

  const headerHeight = HEADER_HEIGHT + insets.top;

  // 카테고리별 그룹핑
  const groupedAchievements = useMemo(() => {
    const groups: Record<'streak' | 'consume' | 'register' | 'shopping', Achievement[]> = {
      streak: [],
      consume: [],
      register: [],
      shopping: [],
    };

    state.achievements.forEach((achievement) => {
      groups[achievement.category].push(achievement);
    });

    return groups;
  }, [state.achievements]);

  const categoryLabels: Record<'streak' | 'consume' | 'register' | 'shopping', string> = {
    streak: t('achievement.categories.streak'),
    consume: t('achievement.categories.consume'),
    register: t('achievement.categories.register'),
    shopping: t('achievement.categories.shopping'),
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        content: {
          flex: 1,
        },
        scrollContent: {
          padding: spacing.lg,
          paddingBottom: insets.bottom + 100,
        },
        categorySection: {
          marginBottom: spacing.xl,
        },
        categoryTitle: {
          marginBottom: spacing.md,
        },
      }),
    [colors, spacing, headerHeight],
  );

  if (!state.statistics) {
    return (
      <View style={styles.container}>
        <Header title={t('achievement.title')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={t('achievement.title')} />

      <View style={styles.content}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
          {/* 통계 카드 */}
          <StatisticsCard statistics={state.statistics} />

          {/* 업적 목록 */}
          {(Object.keys(groupedAchievements) as Array<keyof typeof groupedAchievements>).map((category) => {
            const categoryAchievements = groupedAchievements[category];
            if (categoryAchievements.length === 0) return null;

            return (
              <View key={category} style={styles.categorySection}>
                <Text style={[typography.styles.t3Semibold, { color: colors.text }, styles.categoryTitle]}>
                  {categoryLabels[category]}
                </Text>
                {categoryAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    onClaimBadge={handleClaimBadge}
                    onViewBadge={handleViewBadge}
                  />
                ))}
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* 뱃지 모달 */}
      <BadgeModal visible={showBadgeModal} achievement={selectedAchievement} onClose={handleCloseBadgeModal} />
    </View>
  );
}
