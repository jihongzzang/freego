import { View, StyleSheet } from 'react-native';
import { useEffect, useMemo } from 'react';
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
import { ShoppingTableView } from './components/ShoppingTableView';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';

export default function ShoppingListTableScreen() {
  const { colors, spacing, typography } = useTheme();

  const insets = useSafeAreaInsets();

  const {
    state,
    addShoppingItem,
    handleToggleSelect,
    handleToggleSelectAll,
    handleDeleteSelected,
    handleDeleteItem,
    handleAddSelectedToStorage,
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

  useEffect(() => {
    console.log(state.shoppingList);
  }, [state.shoppingList]);

  const renderHeader = () => <Header title="장보기" />;
  const renderTabBar = (props: any) => (
    <MaterialTabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{ backgroundColor: colors.surface }}
      activeColor={colors.primary}
      inactiveColor={colors.textSecondary}
      labelStyle={typography.styles.t5Semibold}
    />
  );

  const UnpurchasedRoute = () => {
    if (state.loading) {
      return (
        <View style={styles.sceneContainer}>
          <EmptyStateUI title="로딩 중이에요..." />
        </View>
      );
    }

    if (unpurchasedItems.length === 0) {
      return (
        <View style={styles.sceneContainer}>
          <EmptyStateUI
            icon={<ShoppingCart size={64} color={colors.textTertiary} />}
            title="구매 예정 항목이 없어요."
            description="식재료를 소모하면 자동으로 추가돼요"
          />
        </View>
      );
    }

    return (
      <Tabs.ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ShoppingTableView
          items={unpurchasedItems}
          selectedIds={state.selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onDeleteSelected={handleDeleteSelected}
          onAddSelectedToStorage={handleAddSelectedToStorage}
          onDeleteItem={handleDeleteItem}
          onMemoPress={handleMemoPress}
          onAddToStorage={handleAddToStorage}
        />
      </Tabs.ScrollView>
    );
  };

  const PurchasedRoute = () => {
    if (state.loading) {
      return (
        <View style={styles.sceneContainer}>
          <EmptyStateUI title="로딩 중이에요..." />
        </View>
      );
    }

    if (purchasedItems.length === 0) {
      return (
        <View style={styles.sceneContainer}>
          <EmptyStateUI
            icon={<ShoppingCart size={64} color={colors.textTertiary} />}
            title="구매 완료 항목이 없어요."
            description=""
          />
        </View>
      );
    }

    return (
      <Tabs.ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ShoppingTableView
          items={purchasedItems}
          selectedIds={state.selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onDeleteSelected={handleDeleteSelected}
          onAddSelectedToStorage={handleAddSelectedToStorage}
          onDeleteItem={handleDeleteItem}
          onMemoPress={handleMemoPress}
          onAddToStorage={handleAddToStorage}
        />
      </Tabs.ScrollView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Tabs.Container
        renderHeader={renderHeader}
        renderTabBar={renderTabBar}
        headerContainerStyle={{
          shadowOpacity: 0,
          elevation: 0,
          backgroundColor: colors.surface,
        }}
      >
        <Tabs.Tab name="unpurchased" label="구매 예정">
          <UnpurchasedRoute />
        </Tabs.Tab>
        <Tabs.Tab name="purchased" label="구매 완료">
          <PurchasedRoute />
        </Tabs.Tab>
      </Tabs.Container>

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
    header: {
      paddingHorizontal: spacing.lg,
    },
    sceneContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 200,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
  });
