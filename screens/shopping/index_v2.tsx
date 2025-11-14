import { View, StyleSheet, useWindowDimensions, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
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
import EmojiBottomSheet from '@/components/EmojiBottomSheet';

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
    dispatch,
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
    handleEmojiPress,
    editingEmojiId,
    handleEmojiClose,
    handleEmojiSubmit,
  } = useShoppingLogic();

  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>([
    { key: 'unpurchased', title: '구매 예정' },
    { key: 'purchased', title: '구매 완료' },
  ]);

  const horizontalScrollRef = useRef<ScrollView>(null);

  const unpurchasedItems = useMemo(() => state.shoppingList.filter((item) => !item.is_purchased), [state.shoppingList]);
  const purchasedItems = useMemo(() => state.shoppingList.filter((item) => item.is_purchased), [state.shoppingList]);

  // 탭이 바뀔 때 선택 해제
  useEffect(() => {
    console.log('🟣 Tab changed:', { index, route: routes[index].key });
    dispatch({ type: 'CLEAR_SELECTION' });
  }, [index, dispatch, routes]);

  const headerHeight = HEADER_HEIGHT + insets.top;
  const totalHeaderHeight = headerHeight + TAB_BAR_HEIGHT;

  const styles = useMemo(
    () => createStyles({ spacing, colors, totalHeaderHeight }),
    [spacing, colors, totalHeaderHeight],
  );

  // selectedIds에서 구매 완료된 항목만 제거 (나머지는 유지)
  useEffect(() => {
    const unpurchasedIds = new Set(unpurchasedItems.map((item) => item.id));
    const hasInvalidSelection = Array.from(state.selectedIds).some((id) => !unpurchasedIds.has(id));

    // 선택된 항목 중 구매 완료된 것이 있으면, 구매 예정 항목만 남기기
    if (hasInvalidSelection && state.selectedIds.size > 0) {
      console.log('🔸 Removing purchased items from selection (keeping unpurchased)');
      // 구매 예정 항목만 필터링해서 새로운 선택 상태로 업데이트
      const validSelectedIds = Array.from(state.selectedIds).filter((id) => unpurchasedIds.has(id));

      // 유효한 선택이 있으면 그것만 유지, 없으면 전체 초기화
      if (validSelectedIds.length > 0) {
        console.log('🔸 Keeping valid selections:', validSelectedIds);
        dispatch({ type: 'SET_SELECTION', payload: { ids: validSelectedIds } });
      } else {
        console.log('🔸 No valid selections remaining, clearing all');
        dispatch({ type: 'CLEAR_SELECTION' });
      }
    }
  }, [unpurchasedItems, state.selectedIds, dispatch]);

  // selectedIds 변경 추적
  useEffect(() => {
    console.log('⭐ selectedIds changed:', {
      size: state.selectedIds.size,
      ids: Array.from(state.selectedIds),
    });
  }, [state.selectedIds]);

  // Handle horizontal scroll - update selected tab
  const handleHorizontalScroll = useCallback(
    (event: any) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(offsetX / layout.width);
      if (newIndex !== index) {
        setIndex(newIndex);
      }
    },
    [layout.width, index],
  );

  // Handle tab press
  const handleTabPress = useCallback(
    (tabIndex: number) => {
      if (horizontalScrollRef.current) {
        horizontalScrollRef.current.scrollTo({
          x: tabIndex * layout.width,
          animated: true,
        });
      }
      setIndex(tabIndex);
    },
    [layout.width],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <Header title="장보기" />
        <View style={styles.tabBar}>
          {routes.map((route, i) => {
            const isActive = index === i;
            return (
              <TouchableOpacity key={route.key} style={styles.tabItem} onPress={() => handleTabPress(i)}>
                <Text
                  style={[
                    typography.styles.t6Bold,
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

      {/* Horizontal Scrollable Content */}
      <ScrollView
        ref={horizontalScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleHorizontalScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {routes.map((route) => {
          const isUnpurchasedRoute = route.key === 'unpurchased';
          const items = isUnpurchasedRoute ? unpurchasedItems : purchasedItems;
          const isEmpty = items.length === 0;

          return (
            <View key={route.key} style={{ width: layout.width }}>
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: insets.bottom + 80,
                  paddingHorizontal: spacing.lg,
                  paddingTop: totalHeaderHeight + spacing.lg,
                }}
                showsVerticalScrollIndicator={false}
              >
                {state.loading ? (
                  <View style={styles.sceneContainer}>
                    <EmptyStateUI title="로딩 중이에요..." />
                  </View>
                ) : isEmpty ? (
                  <View style={styles.sceneContainer}>
                    <EmptyStateUI
                      icon={<ShoppingCart size={64} color={colors.textTertiary} />}
                      title={isUnpurchasedRoute ? '구매 예정 항목이 없어요.' : '구매 완료 항목이 없어요.'}
                      description={isUnpurchasedRoute ? '식재료를 소모하면 자동으로 추가돼요' : ''}
                    />
                  </View>
                ) : (
                  <ShoppingTableView
                    items={items}
                    selectedIds={state.selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onToggleSelectAll={handleToggleSelectAll}
                    onDeleteSelected={handleDeleteSelected}
                    onAddSelectedToStorage={handleAddSelectedToStorage}
                    onDeleteItem={handleDeleteItem}
                    onMemoPress={handleMemoPress}
                    onAddToStorage={handleAddToStorage}
                    onEmojiPress={handleEmojiPress}
                    isPurchasedView={!isUnpurchasedRoute}
                  />
                )}
              </ScrollView>
            </View>
          );
        })}
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

      <MemoBottomSheet
        visible={editingMemoId !== null}
        onClose={handleMemoClose}
        title={'메모 수정'}
        memo={editingMemo}
        onMemoChange={handleMemoChange}
        onSubmit={handleMemoSubmit}
      />
      <EmojiBottomSheet
        visible={editingEmojiId !== null}
        title="이모지 선택"
        onClose={handleEmojiClose}
        onSelect={handleEmojiSubmit}
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
      paddingTop: spacing.xxl,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
  });
