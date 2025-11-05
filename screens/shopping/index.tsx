import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useEffect, useCallback, useMemo } from 'react';
import { useFocusEffect } from 'expo-router';
import { ShoppingCart, Trash2, Check } from 'lucide-react-native';
import { useTheme, getCategoryColor } from '@/lib/theme';
import { useDialog } from '@/hooks/useDialog';
import { useMVIStore } from '@/mvi/base';
import { createShoppingStore } from '@/mvi/features/shopping';
import Header from '@/components/Header';
import FloatingButton from '@/components/FloatingButton';
import BottomSheet from '@/components/BottomSheet';
import { getCategoryIcon } from '@/utils/categoryIcons';

export default function ShoppingListScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ShoppingListContent />
    </View>
  );
}

function ShoppingListContent() {
  const { colors, spacing, borderRadius } = useTheme();
  const { alert, confirm, DialogComponent } = useDialog();
  const [state, dispatch, effect] = useMVIStore(createShoppingStore);

  const styles = useMemo(
    () => createStyles({ spacing, borderRadius }),
    [spacing, borderRadius],
  );

  // 디버깅: state 변화 로깅
  useEffect(() => {
    console.log('Shopping state:', {
      loading: state.loading,
      itemCount: state.shoppingList.length,
      error: state.error,
    });
  }, [state.loading, state.shoppingList.length, state.error]);

  // 화면 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      console.log('Shopping screen focused - loading data');
      dispatch({ type: 'LOAD_SHOPPING_LIST' });
    }, [dispatch])
  );
  // Effect 처리
  useEffect(() => {
    if (!effect) return;
    switch (effect.type) {
      case 'SHOW_ALERT':
        alert(
          effect.payload.title,
          effect.payload.message,
          effect.payload.variant,
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
          effect.payload.isDanger,
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
    (item) => !item.is_purchased,
  );
  const purchasedItems = state.shoppingList.filter((item) => item.is_purchased);
  return (
    <>
      <DialogComponent />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          title="장보기"
          rightComponent={
            purchasedItems.length > 0 ? (
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
            ) : undefined
          }
        />
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {state.loading ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                로딩 중이에요...
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

        {/* 플로팅 버튼 */}
        <FloatingButton
          onPress={() => dispatch({ type: 'TOGGLE_ADD_MODAL', payload: true })}
        />
      </View>

      <BottomSheet
        maxHeight={372}
        visible={state.isAddingItem}
        onClose={() => dispatch({ type: 'TOGGLE_ADD_MODAL', payload: false })}
        title="장보기 항목 추가"
      >
        <View style={styles.bottomSheetContainer}>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.bottomSheetContent}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  재료 이름
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  value={state.addForm.name}
                  onChangeText={(text) =>
                    dispatch({
                      type: 'UPDATE_ADD_FORM',
                      payload: { field: 'name', value: text },
                    })
                  }
                  placeholder="예: 양파, 당근"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  카테고리
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryScrollContent}
                >
                  {[
                    '채소',
                    '과일',
                    '육류',
                    '생선류',
                    '유제품',
                    '가공식품',
                    '조미료',
                    '기타',
                  ].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                        },
                        state.addForm.category === cat && {
                          backgroundColor: colors.primaryLight,
                          borderColor: colors.primary,
                        },
                      ]}
                      onPress={() =>
                        dispatch({
                          type: 'UPDATE_ADD_FORM',
                          payload: { field: 'category', value: cat },
                        })
                      }
                    >
                      <View style={styles.categoryChipContent}>
                        {getCategoryIcon(cat, 16)}
                        <Text
                          style={[
                            styles.categoryChipText,
                            { color: colors.textSecondary },
                            state.addForm.category === cat && {
                              color: colors.primary,
                              fontWeight: '600',
                            },
                          ]}
                        >
                          {cat}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </ScrollView>

          <View
            style={[
              styles.confirmButtonContainer,
              {
                backgroundColor: colors.background,
                borderTopColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.confirmButton,
                {
                  backgroundColor: state.addForm.name.trim()
                    ? colors.primary
                    : colors.border,
                },
              ]}
              onPress={() => dispatch({ type: 'SUBMIT_ADD_ITEM' })}
              disabled={!state.addForm.name.trim()}
            >
              <Text
                style={[
                  styles.confirmButtonText,
                  {
                    color: state.addForm.name.trim()
                      ? '#FFFFFF'
                      : colors.textTertiary,
                  },
                ]}
              >
                추가
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </>
  );
}

const createStyles = ({
  spacing,
  borderRadius,
}: {
  spacing: typeof import('@/lib/theme').spacing;
  borderRadius: typeof import('@/lib/theme').borderRadius;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
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
      padding: spacing.xl,
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
      paddingTop: spacing.xl,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
    },
    listCard: {
      borderRadius: borderRadius.lg,
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
      borderRadius: borderRadius.md,
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
    bottomSheetContainer: {
      flex: 1,
      maxHeight: 372,
    },
    bottomSheetContent: {
      padding: 20,
      gap: 20,
      paddingBottom: 20,
    },
    inputGroup: {
      gap: 8,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
    },
    input: {
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      borderWidth: 1,
    },
    categoryScrollContent: {
      gap: 8,
    },
    categoryChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
    },
    categoryChipContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    categoryChipText: {
      fontSize: 13,
    },
    confirmButtonContainer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
    },
    confirmButton: {
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      width: '100%',
    },
    confirmButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });
