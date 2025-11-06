import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useEffect, useCallback, useMemo } from 'react';
import { useFocusEffect } from 'expo-router';
import { ShoppingCart, Trash2, Check } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { useDialog } from '@/contexts/DialogContext';
import { useMVIStore } from '@/mvi/base';
import { createShoppingStore } from '@/mvi/features/shopping';
import Header from '@/components/Header';
import FloatingButton from '@/components/FloatingButton';
import BottomSheet from '@/components/BottomSheet';
import { getCategoryIcon } from '@/utils/getCategoryIcons';
import { getCategoryColor } from '@/utils/getCategoryColors';
import { CATEGORIES } from '@/constants/categories';

export default function ShoppingListScreen() {
  const { colors, spacing, borderRadius, typography } = useTheme();
  const { alert, confirm } = useDialog();
  const [state, dispatch, effect] = useMVIStore(createShoppingStore);

  const styles = useMemo(() => createStyles({ spacing, borderRadius }), [spacing, borderRadius, typography]);

  // 디버깅: state 변화 로깅
  useEffect(() => {}, [state.loading, state.shoppingList.length, state.error]);

  // 화면 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      dispatch({ type: 'LOAD_SHOPPING_LIST' });
    }, [dispatch]),
  );
  // Effect 처리
  useEffect(() => {
    if (!effect) return;
    switch (effect.type) {
      case 'SHOW_ALERT':
        alert({
          title: effect.payload.title,
          message: effect.payload.message,
          type: effect.payload.variant,
        });
        break;
      case 'SHOW_CONFIRM':
        confirm({
          title: effect.payload.title,
          message: effect.payload.message,
          onConfirm: async () => {
            await effect.payload.onConfirm();
            // 삭제 후 목록 새로고침
            dispatch({ type: 'LOAD_SHOPPING_LIST' });
          },
          onCancel: undefined,
          confirmText: '삭제',
          cancelText: '취소',
          isDestructive: effect.payload.isDanger,
        });
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
  const unpurchasedItems = state.shoppingList.filter((item) => !item.is_purchased);
  const purchasedItems = state.shoppingList.filter((item) => item.is_purchased);
  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          title="장보기"
          rightComponent={
            purchasedItems.length > 0 ? (
              <TouchableOpacity
                style={[styles.clearButton, { backgroundColor: colors.dangerLight }]}
                onPress={handleClearPurchased}
              >
                <Trash2 size={16} color={colors.danger} />
                <Text style={[typography.styles.buttonSmall, { color: colors.danger }]}>구매완료 삭제</Text>
              </TouchableOpacity>
            ) : undefined
          }
        />
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {state.loading ? (
            <View style={styles.emptyContainer}>
              <Text style={[typography.styles.body, { color: colors.textSecondary }]}>로딩 중이에요...</Text>
            </View>
          ) : state.shoppingList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ShoppingCart size={64} color={colors.textTertiary} />
              <Text style={[typography.styles.bodyMedium, { color: colors.textSecondary }]}>
                장보기 목록이 비어있어요.
              </Text>
              <Text style={[typography.styles.bodySmall, { color: colors.textTertiary }]}>
                식재료를 소모하면 자동으로 추가돼요
              </Text>
            </View>
          ) : (
            <>
              {unpurchasedItems.length > 0 && (
                <View style={styles.section}>
                  <Text style={[typography.styles.h5, { color: colors.text, marginBottom: 24 }]}>구매 예정</Text>
                  <View style={[styles.listCard, { backgroundColor: colors.surface }]}>
                    {unpurchasedItems.map((item, index) => (
                      <View
                        key={item.id}
                        style={[
                          styles.itemRow,
                          { borderBottomColor: colors.border },
                          index === unpurchasedItems.length - 1 && styles.lastItemRow,
                        ]}
                      >
                        <TouchableOpacity
                          style={styles.itemContent}
                          onPress={() => handleTogglePurchased(item.id, item.is_purchased)}
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
                            {item.is_purchased && <Check size={16} color={colors.primary} />}
                          </View>
                          <View style={styles.itemInfo}>
                            <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>{item.name}</Text>
                            <View style={styles.itemMeta}>
                              <View
                                style={[
                                  styles.categoryBadge,
                                  {
                                    backgroundColor: getCategoryColor(item.category) + '20',
                                  },
                                ]}
                              >
                                <Text
                                  style={[typography.styles.captionBold, { color: getCategoryColor(item.category) }]}
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
                  <Text style={[typography.styles.h5, { color: colors.text, marginBottom: 24 }]}>구매 완료</Text>
                  <View style={[styles.listCard, { backgroundColor: colors.surface }]}>
                    {purchasedItems.map((item, index) => (
                      <View
                        key={item.id}
                        style={[
                          styles.itemRow,
                          { borderBottomColor: colors.border },
                          index === purchasedItems.length - 1 && styles.lastItemRow,
                        ]}
                      >
                        <TouchableOpacity
                          style={styles.itemContent}
                          onPress={() => handleTogglePurchased(item.id, item.is_purchased)}
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
                                typography.styles.bodySemibold,
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
                                    backgroundColor: getCategoryColor(item.category) + '20',
                                  },
                                ]}
                              >
                                <Text
                                  style={[typography.styles.captionBold, { color: getCategoryColor(item.category) }]}
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
        <FloatingButton onPress={() => dispatch({ type: 'TOGGLE_ADD_MODAL', payload: true })} />
      </View>

      <BottomSheet
        maxHeight={372}
        visible={state.isAddingItem}
        onClose={() => dispatch({ type: 'TOGGLE_ADD_MODAL', payload: false })}
        title="항목 추가"
      >
        <View style={styles.bottomSheetContainer}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.bottomSheetContent}>
              <View style={styles.inputGroup}>
                <Text style={[typography.styles.label, { color: colors.text }]}>구매예정 재료</Text>
                <TextInput
                  style={[
                    styles.input,
                    typography.styles.body,
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
                <Text style={[typography.styles.label, { color: colors.text }]}>카테고리</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryScrollContent}
                >
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                        },
                        state.addForm.category === cat.id && {
                          backgroundColor: colors.primaryLight,
                          borderColor: colors.primary,
                        },
                      ]}
                      onPress={() =>
                        dispatch({
                          type: 'UPDATE_ADD_FORM',
                          payload: { field: 'category', value: cat.id },
                        })
                      }
                    >
                      <View style={styles.categoryChipContent}>
                        {getCategoryIcon(cat.id, 16)}
                        <Text
                          style={[
                            typography.styles.bodySmall,
                            { color: colors.textSecondary },
                            state.addForm.category === cat.id && {
                              color: colors.primary,
                              fontWeight: '600',
                            },
                          ]}
                        >
                          {cat.krLabel}
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
                  backgroundColor: state.addForm.name.trim() ? colors.primary : colors.border,
                },
              ]}
              onPress={() => dispatch({ type: 'SUBMIT_ADD_ITEM' })}
              disabled={!state.addForm.name.trim()}
            >
              <Text
                style={[
                  typography.styles.button,
                  {
                    color: state.addForm.name.trim() ? '#FFFFFF' : colors.textTertiary,
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
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    clearButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 100,
      gap: 12,
    },
    section: {
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
    lastItemRow: {
      borderBottomWidth: 0,
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
    input: {
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
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
  });
