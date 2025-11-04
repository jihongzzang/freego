import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { ShoppingCart, Trash2, Check } from 'lucide-react-native';
import { useTheme, getCategoryColor } from '@/lib/theme';
import { useDialog } from '@/hooks/useDialog';
import { useMVIStore } from '@/mvi/base';
import { createShoppingStore } from '@/mvi/features/shopping';

export default function ShoppingListScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ShoppingListContent />
    </View>
  );
}

function ShoppingListContent() {
  const { colors } = useTheme();
  const { alert, confirm, DialogComponent } = useDialog();
  const [state, dispatch, effect] = useMVIStore(createShoppingStore);

  // 화면 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      dispatch({ type: 'LOAD_SHOPPING_LIST' });
    }, [])
  );

  // Effect 처리
  useEffect(() => {
    if (!effect) return;

    switch (effect.type) {
      case 'SHOW_ALERT':
        alert(
          effect.payload.title,
          effect.payload.message,
          effect.payload.variant
        );
        break;

      case 'SHOW_CONFIRM':
        confirm(
          effect.payload.title,
          effect.payload.message,
          async () => {
            await effect.payload.onConfirm();
            // 삭제 후 목록 새로고침
            dispatch({ type: 'LOAD_SHOPPING_LIST' });
          },
          undefined,
          '삭제',
          '취소',
          effect.payload.isDanger
        );
        break;
    }
  }, [effect]);

  function handleTogglePurchased(id: string, currentStatus: boolean) {
    dispatch({ type: 'TOGGLE_PURCHASED', payload: { id, currentStatus } });
  }

  function handleDeleteItem(id: string, name: string) {
    dispatch({ type: 'DELETE_ITEM', payload: { id, name } });
  }

  function handleClearPurchased() {
    dispatch({ type: 'CLEAR_PURCHASED' });
  }

  const unpurchasedItems = state.shoppingList.filter(
    (item) => !item.is_purchased
  );
  const purchasedItems = state.shoppingList.filter((item) => item.is_purchased);

  return (
    <>
      <DialogComponent />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.headerTop}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              장보기 목록
            </Text>
            {purchasedItems.length > 0 && (
              <TouchableOpacity
                style={[
                  styles.clearButton,
                  { backgroundColor: colors.dangerLight },
                ]}
                onPress={handleClearPurchased}
              >
                <Trash2 size={16} color={colors.danger} />
                <Text
                  style={[styles.clearButtonText, { color: colors.danger }]}
                >
                  구매완료 삭제
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            {unpurchasedItems.length}개 항목
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {state.loading ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                로딩 중...
              </Text>
            </View>
          ) : state.shoppingList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ShoppingCart size={64} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                장보기 목록이 비어있습니다
              </Text>
              <Text
                style={[styles.emptySubtext, { color: colors.textTertiary }]}
              >
                식재료를 소모하면 자동으로 추가됩니다
              </Text>
            </View>
          ) : (
            <>
              {unpurchasedItems.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    구매 예정
                  </Text>
                  <View
                    style={[
                      styles.listCard,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    {unpurchasedItems.map((item) => (
                      <View
                        key={item.id}
                        style={[
                          styles.itemRow,
                          { borderBottomColor: colors.border },
                        ]}
                      >
                        <TouchableOpacity
                          style={styles.itemContent}
                          onPress={() =>
                            handleTogglePurchased(item.id, item.is_purchased)
                          }
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.checkbox,
                              {
                                borderColor: colors.border,
                                backgroundColor: colors.background,
                              },
                            ]}
                          >
                            {item.is_purchased && (
                              <Check size={16} color={colors.primary} />
                            )}
                          </View>
                          <View style={styles.itemInfo}>
                            <Text
                              style={[styles.itemName, { color: colors.text }]}
                            >
                              {item.name}
                            </Text>
                            <View style={styles.itemMeta}>
                              <View
                                style={[
                                  styles.categoryBadge,
                                  {
                                    backgroundColor:
                                      getCategoryColor(item.category) + '20',
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.categoryText,
                                    { color: getCategoryColor(item.category) },
                                  ]}
                                >
                                  {item.category}
                                </Text>
                              </View>
                              <Text
                                style={[
                                  styles.itemUnit,
                                  { color: colors.textSecondary },
                                ]}
                              >
                                {item.unit}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteItem(item.id, item.name)}
                        >
                          <Trash2 size={20} color={colors.textTertiary} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {purchasedItems.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    구매 완료
                  </Text>
                  <View
                    style={[
                      styles.listCard,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    {purchasedItems.map((item) => (
                      <View
                        key={item.id}
                        style={[
                          styles.itemRow,
                          { borderBottomColor: colors.border },
                        ]}
                      >
                        <TouchableOpacity
                          style={styles.itemContent}
                          onPress={() =>
                            handleTogglePurchased(item.id, item.is_purchased)
                          }
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.checkbox,
                              styles.checkboxChecked,
                              {
                                backgroundColor: colors.primary,
                                borderColor: colors.primary,
                              },
                            ]}
                          >
                            <Check size={16} color="#ffffff" />
                          </View>
                          <View style={styles.itemInfo}>
                            <Text
                              style={[
                                styles.itemName,
                                styles.itemNamePurchased,
                                { color: colors.textTertiary },
                              ]}
                            >
                              {item.name}
                            </Text>
                            <View style={styles.itemMeta}>
                              <View
                                style={[
                                  styles.categoryBadge,
                                  {
                                    backgroundColor:
                                      getCategoryColor(item.category) + '20',
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.categoryText,
                                    { color: getCategoryColor(item.category) },
                                  ]}
                                >
                                  {item.category}
                                </Text>
                              </View>
                              <Text
                                style={[
                                  styles.itemUnit,
                                  { color: colors.textTertiary },
                                ]}
                              >
                                {item.unit}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteItem(item.id, item.name)}
                        >
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
