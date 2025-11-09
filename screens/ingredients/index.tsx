import { View, StyleSheet, Animated } from 'react-native';
import { useMemo } from 'react';
import { QrCode, Edit3, Grid3x3 } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Header from '@/components/ui/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FloatingButton from '@/components/ui/FloatingButton';
import BulkAddBottomSheet from '@/components/BulkAddBottomSheet';
import EmptyStateUI from '@/components/ui/EmptyState';
import { useIngredientsLogic } from './hooks/useIngredientsLogic';
import { useIngredientsData } from './hooks/useIngredientsData';
import { useIngredientsAnimation } from './hooks/useIngredientsAnimation';
import { ViewModeTabs } from './components/ViewModeTabs';
import { CategoryAccordion } from './components/CategoryAccordion';
import { StorageAccordion } from './components/StorageAccordion';

export default function IngredientsScreen() {
  const { colors, spacing } = useTheme();
  const inset = useSafeAreaInsets();

  const {
    ingredients,
    loading,
    viewMode,
    setViewMode,
    scrollY,
    scrollViewRef,
    bulkAdd,
    navigateToDetail,
    navigateToEdit,
    quickDeduct,
    handleAddDirect,
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
    getDaysRemaining,
  } = useIngredientsData(ingredients);

  const { headerTranslateY, contentOpacity, useNativeDriver } = useIngredientsAnimation(scrollY);

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          <Header title="재료 관리" />
        </Animated.View>

        <ViewModeTabs viewMode={viewMode} onChangeMode={setViewMode} />
      </Animated.View>

      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={{
          paddingTop: 56 + 56 + inset.top + 16,
          paddingHorizontal: spacing.lg,
          paddingBottom: 180,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver,
        })}
        scrollEventThrottle={16}
        removeClippedSubviews={false}
      >
        {loading ? (
          <EmptyStateUI title="로딩 중이에요..." />
        ) : viewMode === 'category' ? (
          <View style={styles.categoriesContainer}>
            {categoryOrder.map((catId) => {
              const categoryItems = groupedByCategory[catId] || [];
              const isExpanded = !collapsedCategories.has(catId);

              return (
                <CategoryAccordion
                  key={catId}
                  categoryId={catId}
                  items={categoryItems}
                  isExpanded={isExpanded}
                  onToggle={() => toggleCategory(catId)}
                  onItemPress={navigateToDetail}
                  onItemEdit={navigateToEdit}
                  onQuickDeduct={quickDeduct}
                  getDaysRemaining={getDaysRemaining}
                />
              );
            })}
          </View>
        ) : (
          <View style={styles.categoriesContainer}>
            {storageOrder.map((storageId) => {
              const storageItems = groupedByStorage[storageId] || [];
              const isExpanded = !collapsedStorages.has(storageId);

              return (
                <StorageAccordion
                  key={storageId}
                  storageId={storageId}
                  items={storageItems}
                  isExpanded={isExpanded}
                  onToggle={() => toggleStorage(storageId)}
                  onItemPress={navigateToDetail}
                  onItemEdit={navigateToEdit}
                  onQuickDeduct={quickDeduct}
                  getDaysRemaining={getDaysRemaining}
                />
              );
            })}
          </View>
        )}
      </Animated.ScrollView>

      <FloatingButton
        menuItems={[
          {
            icon: <QrCode size={24} color="#FFFFFF" />,
            label: '영수증으로 재료 등록',
            onPress: bulkAdd.handleRegisterReceipt,
            labelColor: colors.white,
            backgroundColor: colors.blue500,
          },
          {
            icon: <Edit3 size={24} color="#FFFFFF" />,
            label: '직접 재료 등록',
            onPress: handleAddDirect,
            labelColor: colors.white,
            backgroundColor: colors.primary,
          },
          {
            icon: <Grid3x3 size={24} color="#FFFFFF" />,
            label: '한꺼번에 재료 등록',
            onPress: bulkAdd.open,
            labelColor: colors.white,
            backgroundColor: colors.orange500,
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
    },
    categoriesContainer: {
      gap: spacing.xl,
    },
  });
