import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { ShoppingCart, Trash2, Check, Plus } from 'lucide-react-native';
import { storage, ShoppingItem } from '@/lib/storage';
import { useTheme } from '@/lib/theme';
import { useDialog } from '@/hooks/useDialog';

export default function ShoppingListScreen() {
  const { colors } = useTheme();
  const { alert, confirm, DialogComponent } = useDialog();
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchShoppingList();
    }, [])
  );

  async function fetchShoppingList() {
    try {
      setLoading(true);
      const items = await storage.getShoppingList();
      setShoppingList(items);
    } catch (error) {
      console.error('Error fetching shopping list:', error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePurchased(id: string, currentStatus: boolean) {
    try {
      await storage.updateShoppingItem(id, { is_purchased: !currentStatus });
      fetchShoppingList();
    } catch (error) {
      console.error('Error toggling purchased status:', error);
    }
  }

  async function deleteItem(id: string, name: string) {
    confirm(
      '삭제 확인',
      `"${name}"을(를) 장보기 목록에서 삭제하시겠습니까?`,
      async () => {
        try {
          await storage.deleteShoppingItem(id);
          fetchShoppingList();
        } catch (error) {
          console.error('Error deleting shopping item:', error);
        }
      },
      undefined,
      '삭제',
      '취소',
      true
    );
  }

  async function clearPurchased() {
    const purchasedItems = shoppingList.filter(item => item.is_purchased);
    if (purchasedItems.length === 0) {
      alert('알림', '구매한 항목이 없습니다.', 'info');
      return;
    }

    confirm(
      '구매 완료 항목 삭제',
      `${purchasedItems.length}개의 구매 완료 항목을 삭제하시겠습니까?`,
      async () => {
        try {
          for (const item of purchasedItems) {
            await storage.deleteShoppingItem(item.id);
          }
          fetchShoppingList();
        } catch (error) {
          console.error('Error clearing purchased items:', error);
        }
      },
      undefined,
      '삭제',
      '취소',
      true
    );
  }

  function getCategoryColor(category: string) {
    const colors: { [key: string]: string } = {
      채소: '#10b981',
      과일: '#f59e0b',
      육류: '#ef4444',
      유제품: '#3b82f6',
      기타: '#6b7280',
    };
    return colors[category] || '#6b7280';
  }

  const unpurchasedItems = shoppingList.filter(item => !item.is_purchased);
  const purchasedItems = shoppingList.filter(item => item.is_purchased);

  return (
    <>
      <DialogComponent />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.headerTop}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>장보기 목록</Text>
          {purchasedItems.length > 0 && (
            <TouchableOpacity
              style={[styles.clearButton, { backgroundColor: colors.dangerLight }]}
              onPress={clearPurchased}>
              <Trash2 size={16} color={colors.danger} />
              <Text style={[styles.clearButtonText, { color: colors.danger }]}>구매완료 삭제</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {unpurchasedItems.length}개 항목
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>로딩 중...</Text>
          </View>
        ) : shoppingList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ShoppingCart size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>장보기 목록이 비어있습니다</Text>
            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
              식재료를 소모하면 자동으로 추가됩니다
            </Text>
          </View>
        ) : (
          <>
            {unpurchasedItems.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>구매 예정</Text>
                <View style={[styles.listCard, { backgroundColor: colors.surface }]}>
                  {unpurchasedItems.map((item) => (
                    <View key={item.id} style={[styles.itemRow, { borderBottomColor: colors.border }]}>
                      <TouchableOpacity
                        style={styles.itemContent}
                        onPress={() => togglePurchased(item.id, item.is_purchased)}
                        activeOpacity={0.7}>
                        <View
                          style={[
                            styles.checkbox,
                            { borderColor: colors.border, backgroundColor: colors.background },
                          ]}>
                          {item.is_purchased && <Check size={16} color={colors.primary} />}
                        </View>
                        <View style={styles.itemInfo}>
                          <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                          <View style={styles.itemMeta}>
                            <View
                              style={[
                                styles.categoryBadge,
                                { backgroundColor: getCategoryColor(item.category) + '20' },
                              ]}>
                              <Text
                                style={[
                                  styles.categoryText,
                                  { color: getCategoryColor(item.category) },
                                ]}>
                                {item.category}
                              </Text>
                            </View>
                            <Text style={[styles.itemUnit, { color: colors.textSecondary }]}>
                              {item.unit}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteItem(item.id, item.name)}>
                        <Trash2 size={20} color={colors.textTertiary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {purchasedItems.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>구매 완료</Text>
                <View style={[styles.listCard, { backgroundColor: colors.surface }]}>
                  {purchasedItems.map((item) => (
                    <View key={item.id} style={[styles.itemRow, { borderBottomColor: colors.border }]}>
                      <TouchableOpacity
                        style={styles.itemContent}
                        onPress={() => togglePurchased(item.id, item.is_purchased)}
                        activeOpacity={0.7}>
                        <View
                          style={[
                            styles.checkbox,
                            styles.checkboxChecked,
                            { backgroundColor: colors.primary, borderColor: colors.primary },
                          ]}>
                          <Check size={16} color="#ffffff" />
                        </View>
                        <View style={styles.itemInfo}>
                          <Text
                            style={[
                              styles.itemName,
                              styles.itemNamePurchased,
                              { color: colors.textTertiary },
                            ]}>
                            {item.name}
                          </Text>
                          <View style={styles.itemMeta}>
                            <View
                              style={[
                                styles.categoryBadge,
                                { backgroundColor: getCategoryColor(item.category) + '20' },
                              ]}>
                              <Text
                                style={[
                                  styles.categoryText,
                                  { color: getCategoryColor(item.category) },
                                ]}>
                                {item.category}
                              </Text>
                            </View>
                            <Text style={[styles.itemUnit, { color: colors.textTertiary }]}>
                              {item.unit}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteItem(item.id, item.name)}>
                        <Trash2 size={20} color={colors.textTertiary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  listCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderWidth: 0,
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemNamePurchased: {
    textDecorationLine: 'line-through',
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemUnit: {
    fontSize: 13,
  },
  deleteButton: {
    padding: 8,
  },
});
