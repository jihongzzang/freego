import { View, TouchableOpacity, Platform, Dimensions, ScrollView } from 'react-native';
import { Bell, Edit3, Grid3x3 } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Header, { HEADER_HEIGHT } from '@/components/ui/Header';
import FloatingButton from '@/components/ui/FloatingButton';
import SelectDateBottomSheet from '@/components/SelectDateBottomSheet';
import BulkAddBottomSheet from '@/components/BulkAddBottomSheet';
import EmptyStateUI from '@/components/ui/EmptyState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHomeLogic } from './hooks/useHomeLogic';
import { useHomeData } from './hooks/useHomeData';
import { CategoryCarousel, CategoryCarouselRef } from './components/CategoryCarousel';
import { IngredientsSection } from './components/IngredientsSection';
import { Category } from '@/data/enums/category';
import { useRef, useCallback } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, spacing } = useTheme();
  const inset = useSafeAreaInsets();

  // Logic hooks
  const {
    state,
    dispatch,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedIngredient,
    openDatePicker,
    getFloatingMenuItems,
    expiryDatePicker,
    bulkAdd,
    navigateIngredientDetail,
  } = useHomeLogic();

  // Data hooks
  const { expiringItems, getCategoryCount, getExpiryDisplay, categories, ingredientsByCategory } = useHomeData(
    state.ingredients,
    selectedCategoryId,
  );

  // Horizontal scroll ref
  const horizontalScrollRef = useRef<ScrollView>(null);
  const categoryCarouselRef = useRef<CategoryCarouselRef>(null);

  // Handle category change - scroll to category page
  const handleCategorySelect = useCallback(
    (categoryId: Category) => {
      const categoryIndex = categories.findIndex((cat) => cat.id === categoryId);
      if (categoryIndex !== -1 && horizontalScrollRef.current) {
        horizontalScrollRef.current.scrollTo({
          x: categoryIndex * SCREEN_WIDTH,
          animated: true,
        });
      }
      setSelectedCategoryId(categoryId);
    },
    [categories, setSelectedCategoryId],
  );

  // Handle horizontal scroll - update selected category
  const handleHorizontalScroll = useCallback(
    (event: any) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / SCREEN_WIDTH);
      const category = categories[index];
      if (category && category.id !== selectedCategoryId) {
        setSelectedCategoryId(category.id);
        // Auto scroll category carousel
        categoryCarouselRef.current?.scrollToCategory(category.id);
      }
    },
    [categories, selectedCategoryId, setSelectedCategoryId],
  );

  const floatingMenuItems = getFloatingMenuItems();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Fixed Header */}
      <View
        style={{
          backgroundColor: colors.surface,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Header
          title="내 냉장고"
          // rightComponent={
          //   <TouchableOpacity
          //     style={{
          //       width: 44,
          //       height: 44,
          //       borderRadius: 100,
          //       justifyContent: 'center',
          //       alignItems: 'flex-end',
          //       position: 'relative',
          //     }}
          //     onPress={() => {
          //       dispatch({ type: 'NAVIGATE_TO_EXPIRING' });
          //     }}
          //   >
          //     <Bell size={24} color={expiringItems.length > 0 ? colors.danger : colors.textSecondary} />
          //     {expiringItems.length > 0 && (
          //       <View
          //         style={{
          //           width: 6,
          //           height: 6,
          //           borderRadius: 3,
          //           backgroundColor: colors.danger,
          //           position: 'absolute',
          //           top: 10,
          //           right: 5,
          //         }}
          //       />
          //     )}
          //   </TouchableOpacity>
          // }
        />

        <CategoryCarousel
          ref={categoryCarouselRef}
          isIncludeAllCategory
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={handleCategorySelect}
          getCategoryCount={getCategoryCount}
        />
      </View>

      <ScrollView
        ref={horizontalScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleHorizontalScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {categories.map((category) => {
          const items = ingredientsByCategory[category.id] || [];
          return (
            <View
              key={category.id}
              style={{
                width: SCREEN_WIDTH,
              }}
            >
              <ScrollView
                contentContainerStyle={{
                  paddingTop: HEADER_HEIGHT + inset.top + 56,
                  paddingBottom: 200,
                  paddingHorizontal: spacing.lg,
                }}
                showsVerticalScrollIndicator={false}
              >
                {state.loading ? (
                  <View style={{ paddingTop: 24 }}>
                    <EmptyStateUI title="로딩 중이에요..." />
                  </View>
                ) : items.length === 0 ? (
                  <View style={{ paddingTop: 24 }}>
                    <EmptyStateUI
                      title={category.id === Category.ALL ? '관리할 재료가 없어요' : `${category.label} 재료가 없어요`}
                      description="기억하고 싶은 재료만 추가해보세요"
                    />
                  </View>
                ) : (
                  <IngredientsSection
                    title={category.id === Category.ALL ? '전체 재료' : category.label}
                    count={items.length}
                    items={items}
                    onCardPress={(item) => navigateIngredientDetail(item.id)}
                    onCalendarPress={openDatePicker}
                    getExpiryDisplay={getExpiryDisplay}
                  />
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
            label: floatingMenuItems[0].label,
            onPress: floatingMenuItems[0].onPress,
            labelColor: colors.white,
            backgroundColor: colors.green600,
          },
          {
            icon: <Grid3x3 size={24} color="#FFFFFF" />,
            label: floatingMenuItems[1].label,
            onPress: floatingMenuItems[1].onPress,
            labelColor: colors.white,
            backgroundColor: colors.orange600,
          },
        ]}
      />

      <SelectDateBottomSheet
        visible={expiryDatePicker.visible}
        onClose={expiryDatePicker.close}
        title={`${selectedIngredient?.name || ''} 유통기한 수정`}
        selectedDate={expiryDatePicker.selectedDate}
        onDateChange={expiryDatePicker.handleDateChange}
        onConfirm={expiryDatePicker.handleConfirm}
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
