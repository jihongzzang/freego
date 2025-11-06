import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useCallback, useMemo } from 'react';
import { useFocusEffect } from 'expo-router';
import { ShoppingCart, Trash2, Check, Plus } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { useDialog } from '@/contexts/DialogContext';
import { useMVIStore } from '@/mvi/base';
import { createShoppingStore } from '@/mvi/features/shopping';
import Header from '@/components/Header';
import { getCategoryColor } from '@/utils/getCategoryColors';
import { findCategoryById } from '@/constants/categories';
import { useAddShoppingItem } from '@/hooks/useAddShoppingItem';
import AddShoppingListBottomSheet from '@/components/AddShoppingListBottomSheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FloatingButton from '@/components/FloatingButton';

export default function ShoppingListScreen() {
  const { colors, spacing, borderRadius, typography } = useTheme();
  const { alert, confirm } = useDialog();
  const [state, dispatch, effect] = useMVIStore(createShoppingStore);
  const insets = useSafeAreaInsets();

  // 장보기 항목 추가 훅
  const addShoppingItem = useAddShoppingItem();

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="장보기" />
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
                              <Text style={[typography.styles.captionBold, { color: getCategoryColor(item.category) }]}>
                                {findCategoryById(item.category)?.krLabel}
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
                <View style={styles.sectionHeader}>
                  <Text style={[typography.styles.h5, { color: colors.text }]}>구매 완료</Text>
                  <TouchableOpacity
                    style={[styles.clearButton, { backgroundColor: colors.dangerLight }]}
                    onPress={handleClearPurchased}
                  >
                    <Trash2 size={14} color={colors.danger} />
                    <Text style={[typography.styles.captionBold, { color: colors.danger }]}>삭제</Text>
                  </TouchableOpacity>
                </View>
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
                        style={[styles.itemContent, { flex: 1 }]}
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
                              <Text style={[typography.styles.captionBold, { color: getCategoryColor(item.category) }]}>
                                {findCategoryById(item.category)?.krLabel}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
      <FloatingButton onPress={addShoppingItem.open} />
      <AddShoppingListBottomSheet
        visible={addShoppingItem.isVisible}
        onClose={addShoppingItem.close}
        name={addShoppingItem.name}
        category={addShoppingItem.category}
        onNameChange={addShoppingItem.handleNameChange}
        onCategoryChange={addShoppingItem.handleCategoryChange}
        onSubmit={addShoppingItem.handleSubmit}
      />
    </View>
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
      marginBottom: spacing.xxl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    listCard: {
      borderRadius: borderRadius.xl,
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
    floatingButton: {
      position: 'absolute',
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
  });
