import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, Clock, Carrot, Apple, Beef, Milk, Package, Minus } from 'lucide-react-native';
import { storage, Ingredient as StoredIngredient } from '@/lib/storage';
import { useTheme, getStatusColor } from '@/lib/theme';

interface Ingredient extends StoredIngredient {
  status: string;
}

export default function ExpiringScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [expiringItems, setExpiringItems] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchIngredients();
    }, [])
  );

  async function fetchIngredients() {
    try {
      const data = await storage.getIngredients();
      const updatedData = data.map(item => ({
        ...item,
        status: calculateStatus(item.expiry_date)
      }));
      const expiring = updatedData.filter(item => item.status === '주의' || item.status === '소모됨');
      setExpiringItems(expiring);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateStatus(expiryDate?: string): string {
    if (!expiryDate) return '신선';
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return '소모됨';
    if (diffDays <= 3) return '주의';
    return '신선';
  }

  function getDaysRemaining(expiryDate?: string): string {
    if (!expiryDate) return '';
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return '만료됨';
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '내일';
    return `${diffDays}일 남음`;
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

  async function quickDeduct(id: string) {
    await storage.deleteIngredient(id);
    fetchIngredients();
  }

  const renderIngredientItem = ({ item }: { item: Ingredient }) => (
    <TouchableOpacity
      style={styles.ingredientItem}
      onPress={() => router.push(`/ingredient/${item.id}`)}
      activeOpacity={0.7}>
      <View style={styles.ingredientLeft}>
        <View style={[styles.categoryIconWrapper, { backgroundColor: colors.primaryLight }]}>
          {getCategoryIcon(item.category)}
        </View>
        <View style={styles.ingredientInfo}>
          <View style={styles.ingredientNameRow}>
            <Text style={[styles.ingredientName, { color: colors.text }]}>{item.name}</Text>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          </View>
          <Text style={[styles.ingredientMeta, { color: colors.textSecondary }]}>
            {item.quantity}{item.unit} · {item.storage_location}
            {item.expiry_date && ` · ${getDaysRemaining(item.expiry_date)}`}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.quickButton, { backgroundColor: colors.surfaceSecondary }]}
        onPress={(e) => {
          e.stopPropagation();
          quickDeduct(item.id);
        }}>
        <Minus size={16} color={colors.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>유통기한 임박</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {expiringItems.length}개가 임박했어요
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>로딩 중이에요...</Text>
          </View>
        ) : expiringItems.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
            <Clock size={48} color={colors.textTertiary} style={{ marginBottom: 16 }} />
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>임박한 재료가 없어요</Text>
            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
              모든 재료가 신선해요!
            </Text>
          </View>
        ) : (
          <View style={[styles.listCard, { backgroundColor: colors.dangerLight }]}>
            {expiringItems.map((item) => renderIngredientItem({ item }))}
          </View>
        )}
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  listCard: {
    borderRadius: 16,
    overflow: 'hidden',
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
  ingredientInfo: {
    flex: 1,
  },
  ingredientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
    textAlign: 'center',
  },
});
