import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { TrendingUp, Package, ShoppingCart, AlertTriangle } from 'lucide-react-native';
import { storage } from '@/lib/storage';
import { useTheme, getCategoryColor, getStorageColor } from '@/lib/theme';

interface Stats {
  totalIngredients: number;
  expiringItems: number;
  totalConsumed: number;
  categoryDistribution: { [key: string]: number };
  storageDistribution: { [key: string]: number };
  recentConsumptions: Array<{ ingredient_name: string; quantity: number; consumed_date: string }>;
}

export default function StatisticsScreen() {
  const { colors } = useTheme();
  const [stats, setStats] = useState<Stats>({
    totalIngredients: 0,
    expiringItems: 0,
    totalConsumed: 0,
    categoryDistribution: {},
    storageDistribution: {},
    recentConsumptions: [],
  });

  useFocusEffect(
    useCallback(() => {
      fetchStatistics();
    }, [])
  );

  async function fetchStatistics() {
    try {
      const ingredients = await storage.getIngredients();

      const totalIngredients = ingredients.length;

      const expiringItems = ingredients.filter((item) => {
        if (!item.expiry_date) return false;
        const today = new Date();
        const expiry = new Date(item.expiry_date);
        const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 3;
      }).length;

      const categoryDistribution: { [key: string]: number } = {};
      ingredients.forEach((item) => {
        categoryDistribution[item.category] = (categoryDistribution[item.category] || 0) + 1;
      });

      const storageDistribution: { [key: string]: number } = {};
      ingredients.forEach((item) => {
        storageDistribution[item.storage_location] =
          (storageDistribution[item.storage_location] || 0) + 1;
      });

      setStats({
        totalIngredients,
        expiringItems,
        totalConsumed: 0,
        categoryDistribution,
        storageDistribution,
        recentConsumptions: [],
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  }


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>통계</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>재고 현황 및 소비 분석</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.primaryLight }]}>
            <View style={styles.statIcon}>
              <Package size={24} color={colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalIngredients}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>전체 식재료</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.secondaryLight }]}>
            <View style={styles.statIcon}>
              <AlertTriangle size={24} color={colors.secondary} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.expiringItems}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>유통기한 임박</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.successLight }]}>
            <View style={styles.statIcon}>
              <TrendingUp size={24} color={colors.success} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalConsumed}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>소비 기록</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>카테고리별 분포</Text>
          <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
            {Object.keys(stats.categoryDistribution).length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>데이터가 없습니다</Text>
            ) : (
              <View style={styles.barChart}>
                {Object.entries(stats.categoryDistribution).map(([category, count]) => {
                  const maxCount = Math.max(...Object.values(stats.categoryDistribution));
                  const percentage = (count / maxCount) * 100;

                  return (
                    <View key={category} style={styles.barItem}>
                      <View style={styles.barLabelContainer}>
                        <Text style={[styles.barLabel, { color: colors.text }]}>{category}</Text>
                        <Text style={[styles.barValue, { color: colors.textSecondary }]}>{count}개</Text>
                      </View>
                      <View style={[styles.barBackground, { backgroundColor: colors.surfaceSecondary }]}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              width: `${percentage}%`,
                              backgroundColor: getCategoryColor(category),
                            },
                          ]}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>보관 위치별 분포</Text>
          <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
            {Object.keys(stats.storageDistribution).length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>데이터가 없습니다</Text>
            ) : (
              <View style={styles.pieChartContainer}>
                {Object.entries(stats.storageDistribution).map(([location, count]) => {
                  const total = Object.values(stats.storageDistribution).reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage = ((count / total) * 100).toFixed(1);

                  return (
                    <View key={location} style={styles.pieItem}>
                      <View
                        style={[
                          styles.pieIndicator,
                          { backgroundColor: getStorageColor(location) },
                        ]}
                      />
                      <Text style={[styles.pieLabel, { color: colors.text }]}>{location}</Text>
                      <Text style={[styles.pieValue, { color: colors.textSecondary }]}>
                        {count}개 ({percentage}%)
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>최근 소비 기록</Text>
          <View style={styles.chartCard}>
            {stats.recentConsumptions.length === 0 ? (
              <Text style={styles.emptyText}>소비 기록이 없습니다</Text>
            ) : (
              <View style={styles.consumptionList}>
                {stats.recentConsumptions.map((item, index) => (
                  <View key={index} style={styles.consumptionItem}>
                    <View style={styles.consumptionIcon}>
                      <ShoppingCart size={16} color="#10b981" />
                    </View>
                    <View style={styles.consumptionInfo}>
                      <Text style={styles.consumptionName}>{item.ingredient_name}</Text>
                      <Text style={styles.consumptionDate}>{item.consumed_date}</Text>
                    </View>
                    <Text style={styles.consumptionQuantity}>{item.quantity}개</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  barChart: {
    gap: 16,
  },
  barItem: {
    gap: 8,
  },
  barLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  barValue: {
    fontSize: 12,
  },
  barBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  pieChartContainer: {
    gap: 12,
  },
  pieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pieIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pieLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  pieValue: {
    fontSize: 14,
  },
  consumptionList: {
    gap: 12,
  },
  consumptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  consumptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  consumptionInfo: {
    flex: 1,
  },
  consumptionName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  consumptionDate: {
    fontSize: 12,
  },
  consumptionQuantity: {
    fontSize: 14,
    fontWeight: '600',
  },
});
