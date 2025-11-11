import { View, StyleSheet, Animated, Platform } from 'react-native';
import { useMemo, useState, useRef } from 'react';
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
import { CategoryCarousel } from '@/screens/home/components/CategoryCarousel';
import { Category } from '@/data/enums/category';

export default function ShoppingListTableScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedCategoryId, setSelectedCategoryId] = useState<Category | 0>(0);
  const scrollY = useRef(new Animated.Value(0)).current;

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

  // 카테고리 필터링 (0은 전체)
  const filteredList = useMemo(() => {
    if (selectedCategoryId === 0) {
      return state.shoppingList;
    }
    return state.shoppingList.filter((item) => item.category === selectedCategoryId);
  }, [state.shoppingList, selectedCategoryId]);

  // 카테고리별 개수 계산
  const getCategoryCount = (categoryId: Category | 0) => {
    if (categoryId === 0) {
      return state.shoppingList.length;
    }
    return state.shoppingList.filter((item) => item.category === categoryId).length;
  };

  // 애니메이션
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -60],
    extrapolate: 'clamp',
  });

  const contentOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated Header */}
      <Animated.View
        style={{
          transform: [{ translateY: headerTranslateY }],
          backgroundColor: colors.surface,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Animated.View style={{ opacity: contentOpacity }}>
          <Header title="장보기" />
        </Animated.View>

        {state.shoppingList.length > 0 && (
          <CategoryCarousel
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={setSelectedCategoryId}
            getCategoryCount={getCategoryCount}
          />
        )}
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: Platform.OS === 'android' ? false : true,
        })}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: 56 + insets.top + 56,
          paddingBottom: insets.bottom + 80,
          paddingHorizontal: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {state.loading ? (
          <View style={{ paddingTop: 24 }}>
            <EmptyStateUI title="로딩 중이에요..." />
          </View>
        ) : filteredList.length === 0 ? (
          <View style={{ paddingTop: 24 }}>
            <EmptyStateUI
              icon={<ShoppingCart size={64} color={colors.textTertiary} />}
              title="장보기 목록이 비어있어요."
              description="식재료를 소모하면 자동으로 추가돼요"
            />
          </View>
        ) : (
          <ShoppingTableView
            items={filteredList}
            selectedIds={state.selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onDeleteSelected={handleDeleteSelected}
            onAddSelectedToStorage={handleAddSelectedToStorage}
            onDeleteItem={handleDeleteItem}
            onMemoPress={handleMemoPress}
            onAddToStorage={handleAddToStorage}
          />
        )}
      </Animated.ScrollView>
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
