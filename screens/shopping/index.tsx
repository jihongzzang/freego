import { View, StyleSheet, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { ShoppingCart } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Header from '@/components/Header';
import AddShoppingListBottomSheet from '@/components/AddShoppingListBottomSheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FloatingButton from '@/components/FloatingButton';
import EmptyStateUI from '@/components/ui/EmptyState';
import { useShoppingLogic } from './hooks/useShoppingLogic';
import { ShoppingSection } from './components/ShoppingSection';

export default function ShoppingListScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    state,
    addShoppingItem,
    handleTogglePurchased,
    handleDeleteItem,
    handleClearPurchased,
    handleClearUnpurchased,
  } = useShoppingLogic();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  const unpurchasedItems = state.shoppingList.filter((item) => !item.is_purchased);
  const purchasedItems = state.shoppingList.filter((item) => item.is_purchased);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="장보기" />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
        }}
      >
        {state.loading ? (
          <EmptyStateUI title="로딩 중이에요..." />
        ) : state.shoppingList.length === 0 ? (
          <EmptyStateUI
            icon={<ShoppingCart size={64} color={colors.textTertiary} />}
            title="장보기 목록이 비어있어요."
            description="식재료를 소모하면 자동으로 추가돼요"
          />
        ) : (
          <>
            <ShoppingSection
              title="구매 예정"
              items={unpurchasedItems}
              onToggleItem={handleTogglePurchased}
              onDeleteItem={handleDeleteItem}
              onClearAll={handleClearUnpurchased}
              clearButtonText="전체삭제"
            />
            <ShoppingSection
              title="구매 완료"
              items={purchasedItems}
              onToggleItem={handleTogglePurchased}
              onDeleteItem={handleDeleteItem}
              onClearAll={handleClearPurchased}
              clearButtonText="삭제"
            />
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

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
  });
