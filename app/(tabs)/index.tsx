import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRef, useEffect, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  ChefHat,
  Plus,
  Clock,
  Minus,
  Bell,
  Package,
  Carrot,
  Apple,
  Beef,
  Milk,
} from 'lucide-react-native';
import { useTheme, getStatusColor } from '@/lib/theme';
import { useMVIStore } from '@/mvi/base';
import { createHomeStore, Ingredient } from '@/mvi/features/home';

export default function DashboardScreen() {
  return (
    <View style={{ flex: 1 }}>
      <DashboardContent />
    </View>
  );
}

function DashboardContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const expiringRef = useRef<View>(null);

  // MVI Store 사용
  const [state, dispatch, effect] = useMVIStore(createHomeStore);
  const { ingredients, loading } = state;

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
    }, [dispatch])
  );

  function getDaysRemaining(daysRemaining: number | null): string {
    if (daysRemaining === null) return '';

    if (daysRemaining < 0) return '만료';
    if (daysRemaining === 0) return '오늘';
    if (daysRemaining === 1) return '내일';
    return `${daysRemaining}일`;
  }

  const expiringItems = ingredients.filter(
    (item) => item.status === '주의' || item.status === '소모됨'
  );

  async function quickDeduct(id: string) {
    dispatch({ type: 'DELETE_INGREDIENT', payload: id });
  }

  function getCategoryIcon(category: string) {
    switch (category) {
      case '채소':
        return <Carrot size={16} color="#10b981" />;
      case '과일':
        return <Apple size={16} color="#ef4444" />;
      case '육류':
        return <Beef size={16} color="#f97316" />;
      case '유제품':
        return <Milk size={16} color="#3b82f6" />;
      default:
        return <Package size={16} color="#8b5cf6" />;
    }
  }

  const renderIngredientItem = ({ item }: { item: Ingredient }) => (
    <TouchableOpacity
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
            <Text style={[styles.ingredientName, { color: colors.text }]}>
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
            style={[styles.ingredientMeta, { color: colors.textSecondary }]}
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
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            안녕하세요 👋
          </Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            기억하고 싶은 재료만!
          </Text>
        </View>
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
              <Text style={styles.badgeText}>{expiringItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface }]}
            onPress={() => dispatch({ type: 'NAVIGATE_TO_ADD' })}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Plus size={24} color={colors.primary} />
            </View>
            <Text style={[styles.actionTitle, { color: colors.text }]}>
              재료 추가해요
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface }]}
            onPress={() => dispatch({ type: 'NAVIGATE_TO_COOKING' })}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: colors.secondaryLight },
              ]}
            >
              <ChefHat size={24} color={colors.secondary} />
            </View>
            <Text style={[styles.actionTitle, { color: colors.text }]}>
              요리해보세요
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <TouchableOpacity
            style={[styles.summaryItem, { backgroundColor: colors.surface }]}
            onPress={() => dispatch({ type: 'NAVIGATE_TO_INGREDIENTS' })}
            activeOpacity={0.7}
          >
            <Package size={20} color={colors.primary} />
            <View style={styles.summaryContent}>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {ingredients.length}개
              </Text>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                보관 중인 재료
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.summaryItem, { backgroundColor: colors.surface }]}
            onPress={() => dispatch({ type: 'NAVIGATE_TO_EXPIRING' })}
            activeOpacity={0.7}
          >
            <Clock size={20} color={colors.danger} />
            <View style={styles.summaryContent}>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {expiringItems.length}개
              </Text>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                유통기한 임박
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {expiringItems.length > 0 && (
          <View ref={expiringRef} style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => dispatch({ type: 'NAVIGATE_TO_EXPIRING' })}
              activeOpacity={0.7}
            >
              <Bell size={20} color={colors.danger} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                유통기한 임박
              </Text>
            </TouchableOpacity>
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
            {expiringItems.length > 3 && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => dispatch({ type: 'NAVIGATE_TO_EXPIRING' })}
              >
                <Text style={[styles.viewMoreText, { color: colors.primary }]}>
                  더 보기
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => dispatch({ type: 'NAVIGATE_TO_INGREDIENTS' })}
            activeOpacity={0.7}
          >
            <Package size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              보관 중인 재료
            </Text>
          </TouchableOpacity>
          {loading ? (
            <View
              style={[
                styles.emptyContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
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
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                관리할 재료가 없어요
              </Text>
              <Text
                style={[styles.emptySubtext, { color: colors.textTertiary }]}
              >
                기억하고 싶은 재료만 추가해보세요
              </Text>
            </View>
          ) : (
            <>
              <View
                style={[styles.listCard, { backgroundColor: colors.surface }]}
              >
                {ingredients
                  .slice(0, 5)
                  .map((item) => renderIngredientItem({ item }))}
              </View>
              {ingredients.length > 5 && (
                <TouchableOpacity
                  style={styles.viewMoreButton}
                  onPress={() => dispatch({ type: 'NAVIGATE_TO_INGREDIENTS' })}
                >
                  <Text
                    style={[styles.viewMoreText, { color: colors.primary }]}
                  >
                    더 보기
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  summaryCard: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  summaryContent: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  alertCard: {
    borderRadius: 16,
    padding: 4,
  },
  listCard: {
    borderRadius: 16,
    padding: 4,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  ingredientLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ingredientMeta: {
    fontSize: 13,
  },
  quickButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  viewMoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
