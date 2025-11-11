import { View, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { Edit3, Grid3x3 } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Header from '@/components/ui/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FloatingButton from '@/components/ui/FloatingButton';
import BulkAddBottomSheet from '@/components/BulkAddBottomSheet';
import EmptyStateUI from '@/components/ui/EmptyState';
import { useIngredientsLogic } from './hooks/useIngredientsLogic';
import { useIngredientsData } from './hooks/useIngredientsData';
import { IngredientsTableAccordion } from './components/IngredientsTableAccordion';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import { getCategoryIcon, getCategoryLabel } from '@/utils/category';
import { getStorageLocationIcon, getStorageLocationLabel } from '@/utils/storageLocation';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';

export default function IngredientsTableScreen() {
  const { colors, spacing, typography } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    ingredients,
    loading,
    bulkAdd,
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

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  const renderHeader = () => <Header title="재료 관리" />;

  const renderTabBar = (props: any) => (
    <MaterialTabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{ backgroundColor: colors.surface }}
      activeColor={colors.primary}
      inactiveColor={colors.textSecondary}
      labelStyle={typography.styles.t6Bold}
    />
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
      <Tabs.ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 180,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
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
                onItemPress={handleNavigateToDetail}
                onItemEdit={handleNavigateToEdit}
                onQuickAdd={handleQuickAdd}
                onQuickDelete={handleQuickDelete}
              />
            );
          })}
        </View>
      </Tabs.ScrollView>
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
      <Tabs.ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 180,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
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
                onItemPress={handleNavigateToDetail}
                onItemEdit={handleNavigateToEdit}
                onQuickAdd={handleQuickAdd}
                onQuickDelete={handleQuickDelete}
              />
            );
          })}
        </View>
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
        <Tabs.Tab name="category" label="카테고리별">
          <CategoryRoute />
        </Tabs.Tab>
        <Tabs.Tab name="storage" label="보관위치별">
          <StorageRoute />
        </Tabs.Tab>
      </Tabs.Container>

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
