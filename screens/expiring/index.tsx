import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useEffect, useCallback, useMemo } from 'react';
import { useFocusEffect } from 'expo-router';
import { Clock, Minus } from 'lucide-react-native';
import { useRouter } from '@/hooks/useRouter';
import { useTheme, getStatusColor } from '@/lib/theme';
import { useMVIStore } from '@/mvi/base';
import { createExpiringStore, Ingredient } from '@/mvi/features/expiring';
import { getCategoryIcon } from '@/utils/categoryIcons';
import Header from '@/components/Header';

export default function ExpiringScreen() {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius } = useTheme();

  // MVI Store 사용
  const [state, dispatch, effect] = useMVIStore(createExpiringStore);
  const { ingredients, loading } = state;

  const styles = useMemo(
    () => createStyles({ borderRadius, spacing }),
    [spacing, borderRadius]
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
    }, [dispatch])
  );

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
        title="빨리 먹어야 해요"
        onBackPress={() => dispatch({ type: 'NAVIGATE_BACK' })}
      />

      <ScrollView
        style={styles.content}
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
          <View
            style={[styles.emptyContainer, { backgroundColor: colors.surface }]}
          >
            <Clock
              size={48}
              color={colors.textTertiary}
              style={{ marginBottom: 16 }}
            />
            <Text
              style={[
                typography.styles.bodySemibold,
                { color: colors.textTertiary, marginBottom: 8 },
              ]}
            >
              임박한 재료가 없어요
            </Text>
            <Text
              style={[
                typography.styles.bodySmall,
                { color: colors.textTertiary },
              ]}
            >
              모든 재료가 신선해요!
            </Text>
          </View>
        ) : (
          <View
            style={[styles.listCard, { backgroundColor: colors.dangerLight }]}
          >
            {ingredients.map((item) => renderIngredientItem({ item }))}
          </View>
        )}
      </ScrollView>
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
      padding: spacing.xl,
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
      borderRadius: borderRadius.full,
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
      borderRadius: borderRadius.full,
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
