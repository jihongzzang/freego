import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRef, useEffect, useCallback, useMemo } from 'react';
import { useFocusEffect } from 'expo-router';
import { useRouter } from '@/hooks/useRouter';
import { Plus, Clock, Minus, Bell, Package } from 'lucide-react-native';
import { useTheme, getStatusColor } from '@/lib/theme';
import { useMVIStore } from '@/mvi/base';
import { createHomeStore, Ingredient } from '@/mvi/features/home';
import { getCategoryIcon } from '@/utils/categoryIcons';
import Header from '@/components/Header';
import FloatingButton from '@/components/FloatingButton';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <DashboardContent />
    </View>
  );
}

function DashboardContent() {
  const router = useRouter();
  const { colors, typography, borderRadius, spacing } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const expiringRef = useRef<View>(null);

  // MVI Store 사용
  const [state, dispatch, effect] = useMVIStore(createHomeStore);
  const { ingredients, loading } = state;

  // 동적 스타일 생성

  const styles = useMemo(
    () => createStyles({ borderRadius, spacing }),
    [spacing, borderRadius],
  );

  // Effect 처리
  useEffect(() => {
    if (effect) {
      switch (effect.type) {
        case 'NAVIGATE':
          router.push(effect.payload as any);
          break;
        case 'SHOW_TOAST':
          console.log(effect.payload);
          break;
      }
    }
  }, [effect, router]);

  // 화면 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      dispatch({ type: 'LOAD_INGREDIENTS' });
    }, [dispatch]),
  );

  function getDaysRemaining(daysRemaining: number | null): string {
    if (daysRemaining === null) return '';

    if (daysRemaining < 0) return '만료';
    if (daysRemaining === 0) return '오늘';
    if (daysRemaining === 1) return '내일';
    return `${daysRemaining}일`;
  }

  const expiringItems = ingredients.filter(
    (item) => item.status === '주의' || item.status === '소모됨',
  );

  // 카테고리별 재료 개수
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    ingredients.forEach((item) => {
      stats[item.category] = (stats[item.category] || 0) + 1;
    });
    return stats;
  }, [ingredients]);

  // 모든 카테고리 정렬 (많은 순)
  const sortedCategories = useMemo(() => {
    return Object.entries(categoryStats).sort(([, a], [, b]) => b - a);
  }, [categoryStats]);

  async function quickDeduct(id: string) {
    dispatch({ type: 'DELETE_INGREDIENT', payload: id });
  }

  const renderIngredientItem = ({ item }: { item: Ingredient }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.ingredientItem}
      onPress={() => dispatch({ type: 'NAVIGATE_TO_DETAIL', payload: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.ingredientLeft}>
        <View
          style={[
            styles.categoryIconWrapper,
            { backgroundColor: colors.primaryLight },
          ]}
        >
          {getCategoryIcon(item.category)}
        </View>
        <View style={styles.ingredientInfo}>
          <View style={styles.ingredientNameRow}>
            <Text
              style={[typography.styles.bodySemibold, { color: colors.text }]}
            >
              {item.name}
            </Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            />
          </View>
          <Text
            style={[typography.styles.caption, { color: colors.textSecondary }]}
          >
            {item.quantity}
            {item.unit} · {item.storage_location}
            {item.daysRemaining !== null &&
              ` · ${getDaysRemaining(item.daysRemaining)}`}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.quickButton,
          { backgroundColor: colors.surfaceSecondary },
        ]}
        onPress={(e) => {
          e.stopPropagation();
          quickDeduct(item.id);
        }}
      >
        <Minus size={16} color={colors.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="내 냉장고"
        rightComponent={
          <TouchableOpacity
            style={[
              styles.notificationButton,
              {
                backgroundColor:
                  expiringItems.length > 0
                    ? colors.dangerLight
                    : colors.surfaceSecondary,
              },
            ]}
            onPress={() => {
              if (expiringItems.length > 0) {
                dispatch({ type: 'NAVIGATE_TO_EXPIRING' });
              }
            }}
          >
            <Bell
              size={20}
              color={
                expiringItems.length > 0 ? colors.danger : colors.textSecondary
              }
            />
            {expiringItems.length > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.danger }]}>
                <Text
                  style={[typography.styles.captionBold, { color: '#FFFFFF' }]}
                >
                  {expiringItems.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Grid 2x2 */}
        <View style={styles.summaryGrid}>
          <TouchableOpacity
            style={[
              styles.summaryGridItem,
              { backgroundColor: colors.surface },
            ]}
            onPress={() => dispatch({ type: 'NAVIGATE_TO_INGREDIENTS' })}
            activeOpacity={0.7}
          >
            <Text style={[typography.styles.h1, { color: colors.text }]}>
              {ingredients.length}
            </Text>
            <View style={styles.summaryBottomRow}>
              <Package size={16} color={colors.primary} />
              <Text
                style={[
                  typography.styles.caption,
                  { color: colors.textSecondary },
                ]}
              >
                나의 식재료
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.summaryGridItem,
              {
                backgroundColor:
                  expiringItems.length > 0
                    ? colors.dangerLight
                    : colors.surface,
              },
            ]}
            onPress={() => dispatch({ type: 'NAVIGATE_TO_EXPIRING' })}
            activeOpacity={0.7}
          >
            <Text
              style={[
                typography.styles.h1,
                {
                  color: expiringItems.length > 0 ? colors.danger : colors.text,
                },
              ]}
            >
              {expiringItems.length}
            </Text>
            <View style={styles.summaryBottomRow}>
              <Clock
                size={16}
                color={
                  expiringItems.length > 0 ? colors.danger : colors.textTertiary
                }
              />
              <Text
                style={[
                  typography.styles.caption,
                  { color: colors.textSecondary },
                ]}
              >
                유통기한 임박
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 카테고리별 요약 - 캐러셀 */}
        {sortedCategories.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Text style={[typography.styles.h5, { color: colors.text }]}>
                  카테고리별 현황
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryCarouselContent}
            >
              {sortedCategories.map(([category, count]) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryStatItem,
                    { backgroundColor: colors.surface },
                  ]}
                  onPress={() =>
                    dispatch({
                      type: 'NAVIGATE_TO_INGREDIENTS',
                      payload: category,
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Text style={[typography.styles.h2, { color: colors.text }]}>
                    {count}
                  </Text>
                  <View style={styles.categoryBottomRow}>
                    {getCategoryIcon(category, 14)}
                    <Text
                      style={[
                        typography.styles.caption,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {category}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {expiringItems.length > 0 && (
          <View ref={expiringRef} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Bell size={20} color={colors.danger} />
                <Text style={[typography.styles.h5, { color: colors.text }]}>
                  유통기한 임박
                </Text>
              </View>
              {expiringItems.length > 3 && (
                <TouchableOpacity
                  onPress={() => dispatch({ type: 'NAVIGATE_TO_EXPIRING' })}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      typography.styles.bodySemibold,
                      { color: colors.primary },
                    ]}
                  >
                    더 보기
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={[
                styles.alertCard,
                { backgroundColor: colors.dangerLight },
              ]}
            >
              {expiringItems
                .slice(0, 3)
                .map((item) => renderIngredientItem({ item }))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Package size={20} color={colors.primary} />
              <Text style={[typography.styles.h5, { color: colors.text }]}>
                나의 식재료
              </Text>
            </View>
            {ingredients.length > 5 && (
              <TouchableOpacity
                onPress={() => dispatch({ type: 'NAVIGATE_TO_INGREDIENTS' })}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    typography.styles.bodySemibold,
                    { color: colors.primary },
                  ]}
                >
                  더 보기
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {loading ? (
            <View
              style={[
                styles.emptyContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text
                style={[
                  typography.styles.bodySemibold,
                  { color: colors.textTertiary },
                ]}
              >
                로딩 중이에요...
              </Text>
            </View>
          ) : ingredients.length === 0 ? (
            <View
              style={[
                styles.emptyContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text
                style={[
                  typography.styles.bodySemibold,
                  { color: colors.textTertiary, marginBottom: 8 },
                ]}
              >
                관리할 재료가 없어요
              </Text>
              <Text
                style={[
                  typography.styles.bodySmall,
                  { color: colors.textTertiary },
                ]}
              >
                기억하고 싶은 재료만 추가해보세요
              </Text>
            </View>
          ) : (
            <View
              style={[styles.listCard, { backgroundColor: colors.surface }]}
            >
              {ingredients
                .slice(0, 5)
                .map((item) => renderIngredientItem({ item }))}
            </View>
          )}
        </View>
      </ScrollView>
      <FloatingButton onPress={() => dispatch({ type: 'NAVIGATE_TO_ADD' })} />
    </View>
  );
}

const createStyles = ({
  borderRadius,
  spacing,
}: {
  borderRadius: typeof import('@/lib/theme').borderRadius;
  spacing: typeof import('@/lib/theme').spacing;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    notificationButton: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    badge: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 18,
      height: 18,
      borderRadius: borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
    },
    summaryGrid: {
      flexDirection: 'row',
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl,
      gap: spacing.md,
    },
    summaryGridItem: {
      flex: 1,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      paddingVertical: spacing.lg,
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 85,
    },
    summaryBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    categoryCarouselContent: {
      gap: spacing.md,
      paddingRight: spacing.xl,
    },
    categoryStatItem: {
      width: 90,
      borderRadius: borderRadius.lg,
      padding: spacing.sm,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 80,
    },
    categoryBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    section: {
      paddingHorizontal: spacing.xl,
      paddingTop: 28,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    sectionHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    alertCard: {
      borderRadius: borderRadius.lg,
      padding: spacing.xs,
    },
    listCard: {
      borderRadius: borderRadius.lg,
      padding: spacing.xs,
    },
    ingredientItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.lg,
      borderRadius: borderRadius.md,
    },
    ingredientLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    categoryIconWrapper: {
      width: 36,
      height: 36,
      borderRadius: borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
    },
    ingredientNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: borderRadius.full,
    },
    ingredientInfo: {
      flex: 1,
    },
    quickButton: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      borderRadius: borderRadius.lg,
      padding: 40,
      alignItems: 'center',
    },
  });
