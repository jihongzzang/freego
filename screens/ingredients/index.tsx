import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useRouter } from '@/hooks/useRouter';
import { Minus, ChevronDown, ChevronUp, Edit3, Grid3x3 } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { useMVIStore } from '@/mvi/base';
import { createIngredientsStore, Ingredient } from '@/mvi/features/ingredients';
import { getCategoryIcon } from '@/utils/getCategoryIcons';
import { getStatusColor } from '@/utils/getStatusColors';
import { CATEGORIES, CategoryType, findCategoryById } from '@/constants/categories';
import { findStorageLocationById } from '@/constants/storageLocations';
import Header from '@/components/Header';
import FloatingButton from '@/components/FloatingButton';
import { findUnitById } from '@/constants/units';
import BulkAddBottomSheet from '@/components/BulkAddBottomSheet';
import { useBulkAdd } from '@/hooks/useBulkAdd';

export default function IngredientsScreen() {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius } = useTheme();

  // 카테고리 순서 (id 기반)
  const categoryOrder: CategoryType[] = CATEGORIES.map((cat) => cat.id);

  // 아코디언 상태 관리 (카테고리별 접힘/펼침) - 처음에는 모두 접힌 상태
  const [collapsedCategories, setCollapsedCategories] = useState<Set<CategoryType>>(new Set(categoryOrder));

  // MVI Store 사용
  const [state, dispatch, effect] = useMVIStore(createIngredientsStore);
  const { ingredients, loading } = state;

  // Bulk Add Hook
  const bulkAdd = useBulkAdd(() => {
    dispatch({ type: 'LOAD_INGREDIENTS' });
  });

  const styles = useMemo(() => createStyles({ borderRadius, spacing }), [spacing, borderRadius]);

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

  // 카테고리별로 재료 그룹화
  const groupedIngredients = useMemo(() => {
    const grouped: Record<CategoryType, Ingredient[]> = {} as Record<CategoryType, Ingredient[]>;

    ingredients.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  }, [ingredients]);

  const sortedCategories = useMemo(() => {
    // 모든 카테고리를 표시 (재료가 없어도)
    return categoryOrder;
  }, [categoryOrder]);

  // 카테고리 접기/펼치기 토글
  const toggleCategory = (category: CategoryType) => {
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
    <View key={item.id} style={styles.ingredientItem}>
      <TouchableOpacity
        style={styles.ingredientLeft}
        onPress={() => dispatch({ type: 'NAVIGATE_TO_DETAIL', payload: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.ingredientInfo}>
          <View style={styles.ingredientNameRow}>
            <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>{item.name}</Text>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          </View>
          <Text style={[typography.styles.caption, { color: colors.textSecondary }]}>
            {item.quantity
              ? item.unit
                ? `${item.quantity}${findUnitById(item.unit)?.krLabel} · ${findStorageLocationById(item.storage_location)?.krLabel}`
                : `${item.quantity} · ${findStorageLocationById(item.storage_location)?.krLabel}`
              : findStorageLocationById(item.storage_location)?.krLabel}
          </Text>
          {/* 유통기한 정보 */}
          {item.expiry_date ? (
            <Text
              style={[
                typography.styles.caption,
                {
                  color: getStatusColor(item.status),
                  marginTop: spacing.xs,
                },
              ]}
            >
              유통기한: {item.expiry_date}
              {item.daysRemaining !== null && ` (${getDaysRemaining(item.daysRemaining)})`}
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
      </TouchableOpacity>

      {/* 액션 버튼 그룹 */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primaryLight }]}
          onPress={(e) => {
            e.stopPropagation();
            dispatch({ type: 'NAVIGATE_TO_DETAIL_EDIT', payload: item.id });
          }}
        >
          <Edit3 size={16} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surfaceSecondary }]}
          onPress={(e) => {
            e.stopPropagation();
            quickDeduct(item.id);
          }}
        >
          <Minus size={16} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="재료 관리" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
            <Text style={[typography.styles.bodySemibold, { color: colors.textTertiary }]}>로딩 중이에요...</Text>
          </View>
        ) : (
          <View style={styles.categoriesContainer}>
            {sortedCategories.map((catId) => {
              const categoryItems = groupedIngredients[catId] || [];
              const isCollapsed = collapsedCategories.has(catId);
              const categoryItem = findCategoryById(catId);

              return (
                <View key={catId} style={styles.categorySection}>
                  <TouchableOpacity
                    style={styles.categoryHeader}
                    onPress={() => toggleCategory(catId)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.categoryHeaderLeft}>
                      {getCategoryIcon(catId, 20)}
                      <Text style={[typography.styles.h6, { color: colors.text }]}>{categoryItem?.krLabel}</Text>
                    </View>
                    <View style={styles.categoryHeaderRight}>
                      <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
                        <Text style={[typography.styles.captionBold, { color: colors.primary }]}>
                          {categoryItems.length}
                        </Text>
                      </View>
                      {isCollapsed ? (
                        <ChevronDown size={20} color={colors.textSecondary} />
                      ) : (
                        <ChevronUp size={20} color={colors.textSecondary} />
                      )}
                    </View>
                  </TouchableOpacity>
                  {!isCollapsed && (
                    <>
                      {categoryItems.length > 0 ? (
                        <View style={[styles.listCard, { backgroundColor: colors.surface }]}>
                          {categoryItems.map((item) => renderIngredientItem({ item }))}
                        </View>
                      ) : (
                        <View style={[styles.emptyCategory, { backgroundColor: colors.surface }]}>
                          <Text style={[typography.styles.bodySmall, { color: colors.textTertiary }]}>
                            재료가 없어요
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
      <FloatingButton
        menuItems={[
          {
            icon: <Edit3 size={24} color="#FFFFFF" />,
            label: '직접 등록',
            onPress: () => dispatch({ type: 'NAVIGATE_TO_ADD' }),
          },
          {
            icon: <Grid3x3 size={24} color="#FFFFFF" />,
            label: '한꺼번에 등록',
            onPress: () => {
              bulkAdd.open();
            },
            backgroundColor: colors.secondary,
          },
        ]}
      />
      <BulkAddBottomSheet
        visible={bulkAdd.isVisible}
        onClose={bulkAdd.close}
        selectedCategoryId={bulkAdd.selectedCategoryId}
        onCategoryChange={bulkAdd.handleCategoryChange}
        selectedTemplates={bulkAdd.selectedTemplates}
        onTemplateToggle={bulkAdd.handleTemplateToggle}
        onConfirm={bulkAdd.handleConfirm}
      />
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
    actionButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    actionButton: {
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
    emptyCategory: {
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
