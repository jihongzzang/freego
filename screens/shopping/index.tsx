import { View, StyleSheet, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { ShoppingCart, Share2, Plus } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Header from '@/components/ui/Header';
import AddShoppingListBottomSheet from '@/components/AddShoppingListBottomSheet';
import EditMemoBottomSheet from '@/components/EditMemoBottomSheet';
import SelectStorageBottomSheet from '@/components/SelectStorageBottomSheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FloatingButton from '@/components/ui/FloatingButton';
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
    handleClearUnpurchased,
    handleAddAllToStorage,
    handleAddToStorage,
    handleStorageSelect,
    selectingStorageForItem,
    setSelectingStorageForItem,
    handleShare,
    handleMemoPress,
    editingMemoId,
    editingMemo,
    handleMemoClose,
    handleMemoChange,
    handleMemoSubmit,
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
              onMemoPress={handleMemoPress}
              onClearAll={handleClearUnpurchased}
              clearButtonText="전체삭제"
            />
            <ShoppingSection
              title="구매 완료"
              items={purchasedItems}
              onToggleItem={handleTogglePurchased}
              onDeleteItem={handleDeleteItem}
              onAddToStorage={handleAddToStorage}
              onClearAll={handleAddAllToStorage}
              clearButtonText="한번에 재고에 넣기"
              isPurchasedSection
            />
          </>
        )}
      </ScrollView>
      <FloatingButton
        menuItems={[
          ...(unpurchasedItems.length > 0
            ? [
                {
                  icon: <Share2 size={24} color="#FFFFFF" />,
                  label: '구매 예정 공유',
                  onPress: handleShare,
                  labelColor: colors.white,
                  backgroundColor: colors.blue500,
                },
              ]
            : []),
          {
            icon: <Plus size={24} color="#FFFFFF" />,
            label: '항목 추가',
            onPress: addShoppingItem.open,
            labelColor: colors.white,
            backgroundColor: colors.primary,
          },
        ]}
      />
      <AddShoppingListBottomSheet
        visible={addShoppingItem.isVisible}
        onClose={addShoppingItem.close}
        name={addShoppingItem.name}
        category={addShoppingItem.category}
        memo={addShoppingItem.memo}
        onNameChange={addShoppingItem.handleNameChange}
        onCategoryChange={addShoppingItem.handleCategoryChange}
        onMemoChange={addShoppingItem.handleMemoChange}
        onSubmit={addShoppingItem.handleSubmit}
      />
      <EditMemoBottomSheet
        visible={editingMemoId !== null}
        onClose={handleMemoClose}
        memo={editingMemo}
        onMemoChange={handleMemoChange}
        onSubmit={handleMemoSubmit}
      />
      <SelectStorageBottomSheet
        visible={selectingStorageForItem !== null}
        onClose={() => setSelectingStorageForItem(null)}
        onSelect={handleStorageSelect}
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
