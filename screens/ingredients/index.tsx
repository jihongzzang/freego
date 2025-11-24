import { View, StyleSheet, useWindowDimensions, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useMemo, useState, useCallback, useRef } from 'react';
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
import { getCategoryIcon, getCategoryLabel } from '@/utils/category';
import { getStorageLocationIcon, getStorageLocationLabel } from '@/utils/storageLocation';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import SelectStorageBottomSheet from '@/components/SelectStorageBottomSheet';
import MemoBottomSheet from '@/components/MemoBottomSheet';
import EmojiBottomSheet from '@/components/EmojiBottomSheet';
import NameBottomSheet from '@/components/NameBottomSheet';
import { useTranslation } from 'react-i18next';

export const TAB_BAR_HEIGHT = 48;

type Route = {
  key: string;
  title: string;
};

export default function IngredientsTableScreen() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'ko' ? 'kr' : 'en';
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
    nameUpdate,
    memoUpdate,
    handleNavigateToDetail,
    handleNavigateToAdd,
    handleQuickDelete,
    handleQuickAdd,
    handleQuickConsume,
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
  } = useIngredientsData(ingredients, loading);

  const [index, setIndex] = useState(0);
  const routes: Route[] = useMemo(
    () => [
      { key: 'category', title: t('ingredients.tabs.byCategory') },
      { key: 'storage', title: t('ingredients.tabs.byStorage') },
    ],
    [t],
  );

  const horizontalScrollRef = useRef<ScrollView>(null);

  const headerHeight = HEADER_HEIGHT + insets.top;
  const totalHeaderHeight = headerHeight + TAB_BAR_HEIGHT;

  const styles = useMemo(() => createStyles({ spacing, colors }), [spacing, colors]);

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

  // Handle tab press - scroll to page
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
        <Header title={t('ingredients.title')} />
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
          const isCategoryRoute = route.key === 'category';
          const items = isCategoryRoute ? categoryOrder : storageOrder;
          const isEmpty = items.length === 0;

          return (
            <View key={route.key} style={{ width: layout.width }}>
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: insets.bottom + 180,
                  paddingHorizontal: spacing.sm,
                  paddingTop: totalHeaderHeight + spacing.lg,
                }}
                showsVerticalScrollIndicator={false}
              >
                {loading ? (
                  <View style={styles.sceneContainer}>
                    <EmptyStateUI title={t('common.loading')} />
                  </View>
                ) : isEmpty ? (
                  <View style={styles.sceneContainer}>
                    <EmptyStateUI title={t('ingredients.empty.title')} description={t('ingredients.empty.description')} />
                  </View>
                ) : (
                  <View style={styles.accordionsContainer}>
                    {isCategoryRoute ? (
                      // Category Route
                      <>
                        {categoryOrder.map((catId) => {
                          const categoryItems = groupedByCategory[catId] || [];
                          const isExpanded = !collapsedCategories.has(catId);

                          return (
                            <IngredientsTableAccordion
                              key={catId}
                              title={getCategoryLabel({ category: catId as Category, lang })}
                              leftIcon={getCategoryIcon(catId as Category, 20)}
                              items={categoryItems}
                              isExpanded={isExpanded}
                              onToggle={() => toggleCategory(catId)}
                              onQuickUpdateEmoji={emojiUpdate.open}
                              onQuickUpdateName={nameUpdate.open}
                              onQuickUpdateExpiry={expiryUpdate.open}
                              onQuickUpdateQuantity={quantityUpdate.open}
                              onQuickUpdateStorage={storageUpdate.open}
                              onQuickUpdateMemo={memoUpdate.open}
                              onQuickAdd={handleQuickAdd}
                              onQuickConsume={handleQuickConsume}
                              onQuickDelete={handleQuickDelete}
                              onViewDetail={handleNavigateToDetail}
                            />
                          );
                        })}
                      </>
                    ) : (
                      // Storage Route
                      <>
                        {storageOrder.map((storageId) => {
                          const storageItems = groupedByStorage[storageId] || [];
                          const isExpanded = !collapsedStorages.has(storageId);

                          return (
                            <IngredientsTableAccordion
                              key={storageId}
                              title={getStorageLocationLabel({
                                storageLocation: storageId as StorageLocation,
                                lang,
                              })}
                              leftIcon={getStorageLocationIcon(storageId as StorageLocation, 20)}
                              items={storageItems}
                              isExpanded={isExpanded}
                              onToggle={() => toggleStorage(storageId)}
                              onQuickUpdateEmoji={emojiUpdate.open}
                              onQuickUpdateName={nameUpdate.open}
                              onQuickUpdateExpiry={expiryUpdate.open}
                              onQuickUpdateQuantity={quantityUpdate.open}
                              onQuickUpdateStorage={storageUpdate.open}
                              onQuickUpdateMemo={memoUpdate.open}
                              onQuickAdd={handleQuickAdd}
                              onQuickDelete={handleQuickDelete}
                              onQuickConsume={handleQuickConsume}
                              onViewDetail={handleNavigateToDetail}
                            />
                          );
                        })}
                      </>
                    )}
                  </View>
                )}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>

      <FloatingButton
        menuItems={[
          {
            icon: <Edit3 size={24} color="#FFFFFF" />,
            label: t('ingredients.floatingButton.addManually'),
            onPress: handleNavigateToAdd,
            labelColor: colors.white,
            backgroundColor: colors.green600,
          },
          {
            icon: <Grid3x3 size={24} color="#FFFFFF" />,
            label: t('ingredients.floatingButton.addBulk'),
            onPress: bulkAdd.open,
            labelColor: colors.white,
            backgroundColor: colors.orange600,
          },
        ]}
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

      <NameBottomSheet
        visible={nameUpdate.isVisible}
        title={t('ingredients.bottomSheet.editName')}
        name={nameUpdate.name}
        onClose={nameUpdate.close}
        onNameChange={nameUpdate.handleNameChange}
        onConfirm={nameUpdate.handleConfirm}
      />

      <EmojiBottomSheet
        visible={emojiUpdate.isVisible}
        title={t('ingredients.bottomSheet.editEmoji')}
        onClose={emojiUpdate.close}
        onSelect={emojiUpdate.handleSelect}
      />

      <SelectDateBottomSheet
        visible={expiryUpdate.isVisible}
        onClose={expiryUpdate.close}
        title={t('ingredients.bottomSheet.editExpiry')}
        selectedDate={expiryUpdate.expiryDate}
        onDateChange={expiryUpdate.handleDateChange}
        onConfirm={expiryUpdate.handleConfirm}
      />

      <QuantityBottomSheet
        visible={quantityUpdate.isVisible}
        onClose={quantityUpdate.close}
        title={t('ingredients.bottomSheet.editQuantity')}
        quantity={quantityUpdate.quantity}
        onQuantityChange={quantityUpdate.handleQuantityChange}
        onConfirm={quantityUpdate.handleConfirm}
      />

      <SelectStorageBottomSheet
        visible={storageUpdate.isVisible}
        title={t('ingredients.bottomSheet.editStorage')}
        onClose={storageUpdate.close}
        onSelect={storageUpdate.handleSelect}
      />

      <MemoBottomSheet
        visible={memoUpdate.isVisible}
        onClose={memoUpdate.close}
        memo={memoUpdate.memo}
        title={t('ingredients.bottomSheet.editMemo')}
        onMemoChange={memoUpdate.handleMemoChange}
        onSubmit={memoUpdate.handleConfirm}
      />
    </View>
  );
}

const createStyles = ({ spacing, colors }: { spacing: typeof import('@/lib/theme').spacing; colors: any }) =>
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
