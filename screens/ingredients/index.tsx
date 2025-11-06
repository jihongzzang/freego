import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { useRouter } from '@/hooks/useRouter';
import { Minus, ChevronDown, ChevronUp, Edit3, Grid3x3, Receipt, QrCode } from 'lucide-react-native';
import { ColorPalette, useTheme } from '@/lib/theme';
import { useMVIStore } from '@/mvi/base';
import { createIngredientsStore, Ingredient } from '@/mvi/features/ingredients';
import { getCategoryIcon } from '@/utils/getCategoryIcons';
import { getStorageLocationIcon } from '@/utils/getStorageLocationIcons';
import { getStatusColor } from '@/utils/getStatusColors';
import { CATEGORIES, CategoryType, findCategoryById } from '@/constants/categories';
import { STORAGE_LOCATIONS, StorageLocationType, findStorageLocationById } from '@/constants/storageLocations';
import Header from '@/components/Header';
import FloatingButton from '@/components/FloatingButton';
import { findUnitById } from '@/constants/units';
import BulkAddBottomSheet from '@/components/BulkAddBottomSheet';
import { useBulkAdd } from '@/hooks/useBulkAdd';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ViewMode = 'category' | 'storage';

export default function IngredientsScreen() {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius } = useTheme();

  // 스크롤 애니메이션
  const scrollY = useRef(new Animated.Value(0)).current;

  // 뷰 모드 상태 (카테고리별 / 저장위치별)
  const [viewMode, setViewMode] = useState<ViewMode>('category');

  // 카테고리 순서 (id 기반)
  const categoryOrder: CategoryType[] = CATEGORIES.map((cat) => cat.id);

  // 저장위치 순서 (id 기반)
  const storageOrder: StorageLocationType[] = STORAGE_LOCATIONS.map((loc) => loc.id);

  // 아코디언 상태 관리 (카테고리별 접힘/펼침) - 처음에는 모두 접힌 상태
  const [collapsedCategories, setCollapsedCategories] = useState<Set<CategoryType>>(new Set(categoryOrder));

  // 아코디언 상태 관리 (저장위치별 접힘/펼침)
  const [collapsedStorages, setCollapsedStorages] = useState<Set<StorageLocationType>>(new Set(storageOrder));

  // MVI Store 사용
  const [state, dispatch, effect] = useMVIStore(createIngredientsStore);
  const { ingredients, loading } = state;

  const inset = useSafeAreaInsets();

  // Bulk Add Hook
  const bulkAdd = useBulkAdd(() => {
    dispatch({ type: 'LOAD_INGREDIENTS' });
  });

  const styles = useMemo(() => createStyles({ borderRadius, spacing, colors }), [spacing, borderRadius, colors]);

  // 헤더 애니메이션
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -60], // 헤더 + 탭 높이 (약 60 + 50)
    extrapolate: 'clamp',
  });

  const contentOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

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
  const groupedByCategory = useMemo(() => {
    const grouped: Record<CategoryType, Ingredient[]> = {} as Record<CategoryType, Ingredient[]>;

    ingredients.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  }, [ingredients]);

  // 저장위치별로 재료 그룹화
  const groupedByStorage = useMemo(() => {
    const grouped: Record<StorageLocationType, Ingredient[]> = {} as Record<StorageLocationType, Ingredient[]>;

    ingredients.forEach((item) => {
      if (!grouped[item.storage_location]) {
        grouped[item.storage_location] = [];
      }
      grouped[item.storage_location].push(item);
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

  // 저장위치 접기/펼치기 토글
  const toggleStorage = (storage: StorageLocationType) => {
    setCollapsedStorages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(storage)) {
        newSet.delete(storage);
      } else {
        newSet.add(storage);
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
      <Animated.View
        pointerEvents="box-none"
        style={{
          transform: [{ translateY: headerTranslateY }],
          backgroundColor: colors.background,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Animated.View style={{ opacity: contentOpacity }}>
          <Header title="재료 관리" />
        </Animated.View>

        {/* 탭 */}
        <View
          style={[
            styles.tabContainer,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.tab, viewMode === 'category' && styles.tabActive]}
            onPress={() => setViewMode('category')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                typography.styles.bodySemibold,
                { color: viewMode === 'category' ? colors.primary : colors.textSecondary },
              ]}
            >
              카테고리별
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, viewMode === 'storage' && styles.tabActive]}
            onPress={() => setViewMode('storage')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                typography.styles.bodySemibold,
                { color: viewMode === 'storage' ? colors.primary : colors.textSecondary },
              ]}
            >
              저장위치별
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.content}
        contentContainerStyle={{
          paddingTop: 56 + 56 + inset.top + 16, // 헤더 + 탭 높이만큼 패딩
          paddingHorizontal: spacing.lg,
          paddingBottom: 180,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
      >
        {loading ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
            <Text style={[typography.styles.bodySemibold, { color: colors.textTertiary }]}>로딩 중이에요...</Text>
          </View>
        ) : viewMode === 'category' ? (
          // 카테고리별 뷰
          <View style={styles.categoriesContainer}>
            {sortedCategories.map((catId) => {
              const categoryItems = groupedByCategory[catId] || [];
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
        ) : (
          // 저장위치별 뷰
          <View style={styles.categoriesContainer}>
            {storageOrder.map((storageId) => {
              const storageItems = groupedByStorage[storageId] || [];
              const isCollapsed = collapsedStorages.has(storageId);
              const storageItem = findStorageLocationById(storageId);

              return (
                <View key={storageId} style={styles.categorySection}>
                  <TouchableOpacity
                    style={styles.categoryHeader}
                    onPress={() => toggleStorage(storageId)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.categoryHeaderLeft}>
                      {getStorageLocationIcon(storageId, 20, colors.text)}
                      <Text style={[typography.styles.h6, { color: colors.text }]}>{storageItem?.krLabel}</Text>
                    </View>
                    <View style={styles.categoryHeaderRight}>
                      <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
                        <Text style={[typography.styles.captionBold, { color: colors.primary }]}>
                          {storageItems.length}
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
                      {storageItems.length > 0 ? (
                        <View style={[styles.listCard, { backgroundColor: colors.surface }]}>
                          {storageItems.map((item) => renderIngredientItem({ item }))}
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
      </Animated.ScrollView>
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
          {
            icon: <QrCode size={24} color="#FFFFFF" />,
            label: '영수증으로 등록',
            onPress: () => {
              bulkAdd.handleRegisterReceipt();
            },
            backgroundColor: colors.danger,
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
  colors,
}: {
  borderRadius: typeof import('@/lib/theme').borderRadius;
  spacing: typeof import('@/lib/theme').spacing;
  colors: ColorPalette;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      gap: spacing.sm,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomColor: colors.primary,
    },
    content: {
      flex: 1,
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
