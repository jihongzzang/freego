import { View, StyleSheet, useWindowDimensions, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useMemo, useState } from 'react';
import { ShoppingCart, Share2, Plus } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Header, { HEADER_HEIGHT } from '@/components/ui/Header';
import AddShoppingListBottomSheet from '@/components/AddShoppingListBottomSheet';
import MemoBottomSheet from '@/components/MemoBottomSheet';
import SelectStorageBottomSheet from '@/components/SelectStorageBottomSheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FloatingButton from '@/components/ui/FloatingButton';
import EmptyStateUI from '@/components/ui/EmptyState';
import { useShoppingLogic } from './hooks/useShoppingLogic';
import { ShoppingTableView } from './components/ShoppingTableView';
import { TabView, SceneRendererProps, NavigationState } from 'react-native-tab-view';

const TAB_BAR_HEIGHT = 48;

type Route = {
  key: string;
  title: string;
};

export default function ShoppingListTableScreen() {
  const { colors, spacing, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();

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

  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>([
    { key: 'unpurchased', title: '구매 예정' },
    { key: 'purchased', title: '구매 완료' },
  ]);

  const headerHeight = HEADER_HEIGHT + insets.top;
  const totalHeaderHeight = headerHeight + TAB_BAR_HEIGHT;

  const styles = useMemo(
    () => createStyles({ spacing, colors, totalHeaderHeight }),
    [spacing, colors, totalHeaderHeight],
  );

  const unpurchasedItems = state.shoppingList.filter((item) => !item.is_purchased);
  const purchasedItems = state.shoppingList.filter((item) => item.is_purchased);

  const renderTabBar = (props: SceneRendererProps & { navigationState: NavigationState<Route> }) => (
    <View style={styles.headerContainer}>
      <Header title="장보기" />
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const isActive = index === i;
          return (
            <TouchableOpacity key={route.key} style={styles.tabItem} onPress={() => setIndex(i)}>
              <Text
                style={[
                  typography.styles.t7Bold,
                  {
                    color: isActive ? colors.primary : colors.textSecondary,
                  },
                ]}
              >
                {route.title}
              </Text>
              {isActive && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
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
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
          paddingHorizontal: spacing.lg,
          paddingTop: totalHeaderHeight + spacing.lg,
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
      </ScrollView>
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
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
          paddingHorizontal: spacing.lg,
          paddingTop: totalHeaderHeight + spacing.lg,
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
      </ScrollView>
    );
  };

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'unpurchased':
        return <UnpurchasedRoute />;
      case 'purchased':
        return <PurchasedRoute />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />

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
      <MemoBottomSheet
        visible={editingMemoId !== null}
        onClose={handleMemoClose}
        title={editingMemo ? '메모 추가' : '메모 수정'}
        memo={editingMemo}
        onMemoChange={handleMemoChange}
        onSubmit={handleMemoSubmit}
      />
      <SelectStorageBottomSheet
        visible={selectingStorageForItem !== null}
        title="냉장고에 넣기"
        description="냉장고에 넣기전 보관위치를 설정해 주세요."
        onClose={() => setSelectingStorageForItem(null)}
        onSelect={handleStorageSelect}
      />
    </View>
  );
}

const createStyles = ({
  spacing,
  colors,
  totalHeaderHeight,
}: {
  spacing: typeof import('@/lib/theme').spacing;
  colors: any;
  totalHeaderHeight: number;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: colors.surface,
    },
    tabBar: {
      flexDirection: 'row',
      height: TAB_BAR_HEIGHT,
      backgroundColor: colors.surface,
    },
    tabItem: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    tabIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
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
