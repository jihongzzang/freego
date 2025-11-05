import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useRouter } from '@/hooks/useRouter';
import { Minus, ChevronDown, ChevronUp, Package } from 'lucide-react-native';
import { useTheme, getStatusColor } from '@/lib/theme';
import { useMVIStore } from '@/mvi/base';
import { createIngredientsStore, Ingredient } from '@/mvi/features/ingredients';
import { getCategoryIcon } from '@/utils/categoryIcons';
import Header from '@/components/Header';
import FloatingButton from '@/components/FloatingButton';

export default function IngredientsScreen() {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius } = useTheme();
  const { category } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const hasScrolledRef = useRef(false);

  // 아코디언 상태 관리 (카테고리별 접힘/펼침)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set(),
  );

  // MVI Store 사용
  const [state, dispatch, effect] = useMVIStore(createIngredientsStore);
  const { ingredients, loading } = state;

  const styles = useMemo(
    () => createStyles({ borderRadius, spacing }),
    [spacing, borderRadius],
  );

  // Effect 처리
  useEffect(() => {
    if (effect) {
      switch (effect.type) {
        case 'NAVIGATE':
          if (effect.payload === 'back') {
            router.back();
          } else {
            router.push(effect.payload as any);
          }
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
      // 화면 재진입 시 스크롤 플래그 리셋
      hasScrolledRef.current = false;
    }, [dispatch]),
  );

  // 카테고리별로 재료 그룹화
  const groupedIngredients = useMemo(() => {
    const grouped: Record<string, Ingredient[]> = {};

    ingredients.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  }, [ingredients]);

  // 카테고리 순서
  const categoryOrder = [
    '채소',
    '과일',
    '육류',
    '생선류',
    '유제품',
    '가공식품',
    '조미료',
    '기타',
  ];

  const sortedCategories = useMemo(() => {
    return Object.keys(groupedIngredients).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);

      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [groupedIngredients]);

  // 카테고리 접기/펼치기 토글
  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  function getDaysRemaining(daysRemaining: number | null): string {
    if (daysRemaining === null) return '';

    if (daysRemaining < 0) return '만료됨';
    if (daysRemaining === 0) return '오늘';
    if (daysRemaining === 1) return '내일';
    return `${daysRemaining}일 남음`;
  }

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
          </Text>
          {/* 유통기한 정보 */}
          {item.expiry_date ? (
            <Text
              style={[
                typography.styles.caption,
                {
                  color:
                    item.status === '소모됨'
                      ? colors.danger
                      : item.status === '주의'
                        ? colors.warning
                        : colors.success,
                  marginTop: spacing.xs,
                },
              ]}
            >
              유통기한: {item.expiry_date}
              {item.daysRemaining !== null &&
                ` (${getDaysRemaining(item.daysRemaining)})`}
            </Text>
          ) : (
            <Text
              style={[
                typography.styles.caption,
                {
                  color: colors.textTertiary,
                  marginTop: spacing.xs,
                  fontStyle: 'italic',
                },
              ]}
            >
              유통기한 입력 필요
            </Text>
          )}
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
      <Header title="재료 관리" />
      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View
            style={[styles.emptyContainer, { backgroundColor: colors.surface }]}
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
          <View style={styles.emptyContainer}>
            <Package size={64} color={colors.textTertiary} />
            <Text
              style={[
                typography.styles.bodyMedium,
                { color: colors.textSecondary },
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
          <View style={styles.categoriesContainer}>
            {sortedCategories.map((cat) => (
              <View
                key={cat}
                style={styles.categorySection}
                collapsable={false}
                onLayout={(event) => {
                  const layout = event.nativeEvent.layout;
                  if (
                    category &&
                    !hasScrolledRef.current &&
                    decodeURIComponent(category as string) === cat
                  ) {
                    hasScrolledRef.current = true;
                    setTimeout(() => {
                      scrollViewRef.current?.scrollTo({
                        y: layout.y - 20,
                        animated: true,
                      });
                    }, 100);
                  }
                }}
              >
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(cat)}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryHeaderLeft}>
                    {getCategoryIcon(cat, 20)}
                    <Text
                      style={[typography.styles.h6, { color: colors.text }]}
                    >
                      {cat}
                    </Text>
                  </View>
                  <View style={styles.categoryHeaderRight}>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: colors.primaryLight },
                      ]}
                    >
                      <Text
                        style={[
                          typography.styles.captionBold,
                          { color: colors.primary },
                        ]}
                      >
                        {groupedIngredients[cat].length}
                      </Text>
                    </View>
                    {collapsedCategories.has(cat) ? (
                      <ChevronDown size={20} color={colors.textSecondary} />
                    ) : (
                      <ChevronUp size={20} color={colors.textSecondary} />
                    )}
                  </View>
                </TouchableOpacity>
                {!collapsedCategories.has(cat) && (
                  <View
                    style={[
                      styles.listCard,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    {groupedIngredients[cat].map((item) =>
                      renderIngredientItem({ item }),
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
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
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    scrollContent: {
      paddingBottom: 180,
    },
    categoriesContainer: {
      gap: spacing.xl,
    },
    categorySection: {
      gap: spacing.md,
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    categoryHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    categoryHeaderRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    categoryBadge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    listCard: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
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
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    ingredientInfo: {
      flex: 1,
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
      borderRadius: 3,
    },
    quickButton: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 100,
      gap: 12,
    },
  });
