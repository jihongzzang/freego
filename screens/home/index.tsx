import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useRouter } from '@/hooks/useRouter';
import { Bell } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { useMVIStore } from '@/mvi/base';
import { createHomeStore, Ingredient } from '@/mvi/features/home';
import Header from '@/components/Header';
import FloatingButton from '@/components/FloatingButton';
import BottomSheet from '@/components/BottomSheet';
import DatePicker from '@/components/DatePicker';

export default function HomeScreen() {
  return <DashboardContent />;
}

function DashboardContent() {
  const router = useRouter();
  const { colors, typography, borderRadius, spacing } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const expiringRef = useRef<View>(null);

  // 선택된 카테고리 상태
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // 유통기한 수정 모달 상태
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  function getExpiryDisplay(
    status: '유효' | '만료' | '미설정',
    daysRemaining: number | null,
  ): string {
    if (status === '미설정') return '유통기한 입력필요';
    if (daysRemaining === null) return '';

    if (daysRemaining < 0) {
      return `소비기한 지남 (D+${Math.abs(daysRemaining)})`;
    }
    return `D-${daysRemaining} 남음`;
  }

  // 유통기한 수정 모달 열기
  function openDatePicker(item: Ingredient) {
    setSelectedIngredient(item);
    if (item.expiry_date) {
      setSelectedDate(new Date(item.expiry_date));
    } else {
      setSelectedDate(new Date());
    }
    setShowDatePicker(true);
  }

  // 날짜 변경 핸들러
  function handleDateChange(date: Date) {
    setSelectedDate(date);
  }

  // 빠른 선택 핸들러
  function handleQuickSelect(days: number) {
    if (!selectedIngredient) return;

    const date = new Date();
    date.setDate(date.getDate() + days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    updateExpiryDate(formattedDate);
  }

  // 유통기한 업데이트
  function updateExpiryDate(expiryDate: string) {
    if (!selectedIngredient) return;

    dispatch({
      type: 'UPDATE_EXPIRY_DATE',
      payload: { id: selectedIngredient.id, expiryDate },
    });
    setShowDatePicker(false);
  }

  // 날짜 확인 버튼 핸들러
  function handleConfirmDate() {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    updateExpiryDate(formattedDate);
  }

  const expiringItems = ingredients.filter((item) => item.status === '만료');

  // 카테고리 목록
  const allCategories = useMemo(
    () => [
      '전체',
      '채소',
      '과일',
      '육류',
      '생선류',
      '유제품',
      '가공식품',
      '조미료',
    ],
    [],
  );

  // 선택된 카테고리에 따른 재료 필터링
  const filteredIngredients = useMemo(() => {
    if (selectedCategory === '전체') {
      return ingredients;
    }
    return ingredients.filter((item) => item.category === selectedCategory);
  }, [ingredients, selectedCategory]);

  const renderIngredientCard = ({ item }: { item: Ingredient }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.ingredientCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={() => openDatePicker(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emojiText}>{item.emoji || '🍽️'}</Text>
          {item.status === '만료' && (
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: colors.danger,
                },
              ]}
            />
          )}
        </View>
        <Text
          style={[styles.ingredientName, { color: colors.text }]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.expiryText,
            {
              color:
                item.status === '만료' ? colors.danger : colors.textTertiary,
            },
          ]}
          numberOfLines={1}
        >
          {getExpiryDisplay(item.status, item.daysRemaining)}
        </Text>
      </View>
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
              dispatch({ type: 'NAVIGATE_TO_EXPIRING' });
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

      {/* 카테고리 캐러셀 - 고정 */}
      <View
        style={[
          styles.categoryCarouselContainer,
          { backgroundColor: colors.surface },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryCarousel}
          contentContainerStyle={styles.categoryCarouselContent}
        >
          {allCategories.map((category) => {
            const isSelected = category === selectedCategory;
            const categoryCount =
              category === '전체'
                ? ingredients.length
                : ingredients.filter((item) => item.category === category)
                    .length;

            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.7}
              >
                <View style={styles.categoryChipContent}>
                  <Text
                    style={[
                      typography.styles.bodySmallMedium,
                      {
                        color: isSelected ? '#FFFFFF' : colors.textSecondary,
                      },
                    ]}
                  >
                    {category}
                  </Text>
                  {categoryCount > 0 && (
                    <View
                      style={[
                        styles.categoryCount,
                        {
                          backgroundColor: isSelected
                            ? 'rgba(255, 255, 255, 0.3)'
                            : colors.surfaceSecondary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.styles.captionBold,
                          {
                            color: isSelected
                              ? '#FFFFFF'
                              : colors.textSecondary,
                          },
                        ]}
                      >
                        {categoryCount}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {expiringItems.length > 0 && (
          <View ref={expiringRef} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Bell size={20} color={colors.danger} />
                <Text style={[typography.styles.h5, { color: colors.text }]}>
                  소비기한 지남
                </Text>
              </View>
              {expiringItems.length > 8 && (
                <TouchableOpacity
                  onPress={() => dispatch({ type: 'NAVIGATE_TO_EXPIRING' })}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      typography.styles.caption,
                      { color: colors.textSecondary },
                    ]}
                  >
                    더보기
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.cardList}>
              {expiringItems
                .slice(0, 8)
                .map((item) => renderIngredientCard({ item }))}
            </View>
          </View>
        )}

        {loading ? (
          <View style={styles.section}>
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
          </View>
        ) : filteredIngredients.length === 0 ? (
          <View style={styles.section}>
            <View
              style={[
                styles.emptyContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text
                style={[
                  typography.styles.bodyMedium,
                  { color: colors.textSecondary, marginBottom: 8 },
                ]}
              >
                {selectedCategory === '전체'
                  ? '관리할 재료가 없어요'
                  : `${selectedCategory} 재료가 없어요`}
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
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[typography.styles.h5, { color: colors.text }]}>
                {selectedCategory === '전체' ? '전체 재료' : selectedCategory}
              </Text>
              <Text
                style={[
                  typography.styles.caption,
                  { color: colors.textSecondary },
                ]}
              >
                {filteredIngredients.length}개
              </Text>
            </View>
            <View style={styles.cardList}>
              {filteredIngredients.map((item) =>
                renderIngredientCard({ item }),
              )}
            </View>
          </View>
        )}
      </ScrollView>
      <FloatingButton onPress={() => dispatch({ type: 'NAVIGATE_TO_ADD' })} />

      {/* 유통기한 수정 BottomSheet */}
      <BottomSheet
        maxHeight={650}
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        title={`${selectedIngredient?.name || ''} 유통기한 수정`}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.datePickerBottomSheet}
          showsVerticalScrollIndicator={false}
        >
          {/* 빠른 선택 옵션 */}
          <View style={styles.quickSelectContainer}>
            {[
              { label: '3일 뒤', days: 3 },
              { label: '7일 뒤', days: 7 },
              { label: '2주 뒤', days: 14 },
              { label: '한달 뒤', days: 30 },
            ].map((option) => (
              <TouchableOpacity
                key={option.days}
                style={[
                  styles.quickSelectBtn,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => handleQuickSelect(option.days)}
              >
                <Text
                  style={[
                    typography.styles.caption,
                    { color: colors.textSecondary },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <DatePicker value={selectedDate} onDateSelect={handleDateChange} />

          <TouchableOpacity
            style={[
              styles.datePickerConfirm,
              { backgroundColor: colors.primary },
            ]}
            onPress={handleConfirmDate}
          >
            <Text style={[typography.styles.button, { color: '#FFFFFF' }]}>
              확인
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheet>
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
      paddingBottom: 200,
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
    categoryCarouselContainer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: '#F2F4F6',
    },
    categoryCarousel: {
      flexGrow: 0,
    },
    categoryCarouselContent: {
      gap: spacing.sm,
    },
    categoryChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
    },
    categoryChipContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryCount: {
      marginLeft: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
      minWidth: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    section: {
      paddingTop: spacing.lg,
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
    cardList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    ingredientCard: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      width: '48%',
    },
    cardContent: {
      alignItems: 'flex-start',
      width: '100%',
    },
    emojiContainer: {
      position: 'relative',
      marginBottom: spacing.xs,
    },
    emojiText: {
      fontSize: 16,
    },
    ingredientName: {
      fontSize: 13,
      fontWeight: '600',
      lineHeight: 18,
    },
    expiryText: {
      fontSize: 11,
      fontWeight: '400',
      lineHeight: 16,
      marginTop: 2,
    },
    statusBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 12,
      height: 12,
      borderRadius: borderRadius.full,
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    emptyContainer: {
      borderRadius: borderRadius.lg,
      padding: 40,
      alignItems: 'center',
    },
    datePickerBottomSheet: {
      padding: spacing.lg,
      gap: spacing.lg,
    },
    quickSelectContainer: {
      flexDirection: 'row',
      gap: spacing.xs,
      flexWrap: 'wrap',
    },
    quickSelectBtn: {
      flex: 1,
      minWidth: '22%',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs + 2,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      alignItems: 'center',
    },
    datePickerConfirm: {
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
    },
  });
