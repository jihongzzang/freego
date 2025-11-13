import { View, StyleSheet, useWindowDimensions, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useMemo, useState } from 'react';
import { Edit3, Grid3x3 } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Header, { HEADER_HEIGHT } from '@/components/ui/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FloatingButton from '@/components/ui/FloatingButton';
import BulkAddBottomSheet from '@/components/BulkAddBottomSheet';
import SelectDateBottomSheet from '@/components/SelectDateBottomSheet';
import QuantityBottomSheet from '@/components/QuantityBottomSheet';
import EmptyStateUI from '@/components/ui/EmptyState';
import { useIngredientsLogic } from './hooks/useIngredientsLogic';
import { useIngredientsData } from './hooks/useIngredientsData';
import { IngredientsTableAccordion } from './components/IngredientsTableAccordion';
import { TabView, SceneRendererProps, NavigationState } from 'react-native-tab-view';
import { getCategoryIcon, getCategoryLabel } from '@/utils/category';
import { getStorageLocationIcon, getStorageLocationLabel } from '@/utils/storageLocation';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import SelectStorageBottomSheet from '@/components/SelectStorageBottomSheet';
import MemoBottomSheet from '@/components/MemoBottomSheet';
import EmojiBottomSheet from '@/components/EmojiBottomSheet';

export const TAB_BAR_HEIGHT = 48;

type Route = {
  key: string;
  title: string;
};

export default function IngredientsTableScreen() {
  const { colors, spacing, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();

  const {
    ingredients,
    loading,
    bulkAdd,
    emojiUpdate,
    quantityUpdate,
    storageUpdate,
    expiryUpdate,
    memoUpdate,
    handleNavigateToDetail,
    handleNavigateToEdit,
    handleNavigateToAdd,
    handleQuickDelete,
    handleQuickAdd,
  } = useIngredientsLogic();

  const {
    categoryOrder,
    storageOrder,
    groupedByCategory,
    groupedByStorage,
    collapsedCategories,
    collapsedStorages,
    toggleCategory,
    toggleStorage,
  } = useIngredientsData(ingredients);

  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>([
    { key: 'category', title: '카테고리별' },
    { key: 'storage', title: '보관위치별' },
  ]);

  const headerHeight = HEADER_HEIGHT + insets.top;
  const totalHeaderHeight = headerHeight + TAB_BAR_HEIGHT;

  const styles = useMemo(
    () => createStyles({ spacing, colors, totalHeaderHeight }),
    [spacing, colors, totalHeaderHeight],
  );

  const renderTabBar = (props: SceneRendererProps & { navigationState: NavigationState<Route> }) => (
    <View style={styles.headerContainer}>
      <Header title="재료 관리" />
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

  const CategoryRoute = () => {
    if (loading) {
      return (
        <View style={styles.sceneContainer}>
          <EmptyStateUI title="로딩 중이에요..." />
        </View>
      );
    }

    if (categoryOrder.length === 0) {
      return (
        <View style={styles.sceneContainer}>
          <EmptyStateUI title="등록된 재료가 없어요." description="재료를 추가해주세요" />
        </View>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 180,
          paddingHorizontal: spacing.lg,
          paddingTop: totalHeaderHeight + spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.accordionsContainer}>
          {categoryOrder.map((catId) => {
            const categoryItems = groupedByCategory[catId] || [];
            const isExpanded = !collapsedCategories.has(catId);

            return (
              <IngredientsTableAccordion
                key={catId}
                title={getCategoryLabel({ category: catId as Category, lang: 'kr' })}
                leftIcon={getCategoryIcon(catId as Category, 20)}
                items={categoryItems}
                isExpanded={isExpanded}
                onToggle={() => toggleCategory(catId)}
                onItemEdit={handleNavigateToEdit}
                onQuickUpdateEmoji={emojiUpdate.open}
                onQuickUpdateExpiry={expiryUpdate.open}
                onQuickUpdateQuantity={quantityUpdate.open}
                onQuickUpdateStorage={storageUpdate.open}
                onQuickUpdateMemo={memoUpdate.open}
                onQuickAdd={handleQuickAdd}
                onQuickDelete={handleQuickDelete}
                onViewDetail={handleNavigateToDetail}
              />
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const StorageRoute = () => {
    if (loading) {
      return (
        <View style={styles.sceneContainer}>
          <EmptyStateUI title="로딩 중이에요..." />
        </View>
      );
    }

    if (storageOrder.length === 0) {
      return (
        <View style={styles.sceneContainer}>
          <EmptyStateUI title="등록된 재료가 없어요." description="재료를 추가해주세요" />
        </View>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 180,
          paddingHorizontal: spacing.lg,
          paddingTop: totalHeaderHeight + spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.accordionsContainer}>
          {storageOrder.map((storageId) => {
            const storageItems = groupedByStorage[storageId] || [];
            const isExpanded = !collapsedStorages.has(storageId);

            return (
              <IngredientsTableAccordion
                key={storageId}
                title={getStorageLocationLabel({ storageLocation: storageId as StorageLocation, lang: 'kr' })}
                leftIcon={getStorageLocationIcon(storageId as StorageLocation, 20)}
                items={storageItems}
                isExpanded={isExpanded}
                onToggle={() => toggleStorage(storageId)}
                onItemEdit={handleNavigateToEdit}
                onQuickUpdateEmoji={emojiUpdate.open}
                onQuickUpdateExpiry={expiryUpdate.open}
                onQuickUpdateQuantity={quantityUpdate.open}
                onQuickUpdateStorage={storageUpdate.open}
                onQuickUpdateMemo={memoUpdate.open}
                onQuickAdd={handleQuickAdd}
                onQuickDelete={handleQuickDelete}
                onViewDetail={handleNavigateToDetail}
              />
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'category':
        return <CategoryRoute />;
      case 'storage':
        return <StorageRoute />;
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
          {
            icon: <Edit3 size={24} color="#FFFFFF" />,
            label: '직접 재료 등록',
            onPress: handleNavigateToAdd,
            labelColor: colors.white,
            backgroundColor: colors.green600,
          },
          {
            icon: <Grid3x3 size={24} color="#FFFFFF" />,
            label: '한꺼번에 재료 등록',
            onPress: bulkAdd.open,
            labelColor: colors.white,
            backgroundColor: colors.orange600,
          },
        ]}
      />

      <EmojiBottomSheet
        visible={emojiUpdate.isVisible}
        onClose={emojiUpdate.close}
        onSelect={emojiUpdate.handleSelect}
      />

      <BulkAddBottomSheet
        visible={bulkAdd.isVisible}
        onClose={bulkAdd.close}
        selectedCategoryId={bulkAdd.selectedCategoryId}
        onCategoryChange={bulkAdd.handleCategoryChange}
        selectedTemplates={bulkAdd.selectedTemplates}
        onTemplateToggle={bulkAdd.handleTemplateToggle}
        onConfirm={bulkAdd.handleConfirm}
      />

      <SelectDateBottomSheet
        visible={expiryUpdate.isVisible}
        onClose={expiryUpdate.close}
        title="유통기한 변경"
        selectedDate={expiryUpdate.expiryDate}
        onDateChange={expiryUpdate.handleDateChange}
        onConfirm={expiryUpdate.handleConfirm}
      />

      <QuantityBottomSheet
        visible={quantityUpdate.isVisible}
        onClose={quantityUpdate.close}
        title="수량 변경"
        quantity={quantityUpdate.quantity}
        onQuantityChange={quantityUpdate.handleQuantityChange}
        onConfirm={quantityUpdate.handleConfirm}
      />

      <SelectStorageBottomSheet
        visible={storageUpdate.isVisible}
        title="보관위치 변경"
        onClose={storageUpdate.close}
        onSelect={storageUpdate.handleSelect}
      />

      <MemoBottomSheet
        visible={memoUpdate.isVisible}
        onClose={memoUpdate.close}
        memo={memoUpdate.memo}
        title="메모 변경"
        onMemoChange={memoUpdate.handleMemoChange}
        onSubmit={memoUpdate.handleConfirm}
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
    sceneContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 200,
    },
    accordionsContainer: {
      gap: spacing.xl,
    },
  });
