import { View, Animated, TouchableOpacity, Platform } from 'react-native';
import { Bell, Edit3, Grid3x3 } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Header from '@/components/ui/Header';
import FloatingButton from '@/components/ui/FloatingButton';
import SelectDateBottomSheet from '@/components/SelectDateBottomSheet';
import BulkAddBottomSheet from '@/components/BulkAddBottomSheet';
import EmptyStateUI from '@/components/ui/EmptyState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHomeLogic } from './hooks/useHomeLogic';
import { useHomeData } from './hooks/useHomeData';
import { useHomeAnimation } from './hooks/useHomeAnimation';
import { CategoryCarousel } from './components/CategoryCarousel';
import { IngredientsSection } from './components/IngredientsSection';

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
    scrollY,
    openDatePicker,
    getFloatingMenuItems,
    expiryDatePicker,
    bulkAdd,
    navigateIngredientDetail,
  } = useHomeLogic();

  // Data hooks
  const { expiringItems, selectedCategoryItem, filteredIngredients, getCategoryCount, getExpiryDisplay } = useHomeData(
    state.ingredients,
    selectedCategoryId,
  );

  // Animation hooks
  const { headerTranslateY, contentOpacity } = useHomeAnimation(scrollY);

  const floatingMenuItems = getFloatingMenuItems();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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
          <Header
            title="내 냉장고"
            rightComponent={
              <TouchableOpacity
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  position: 'relative',
                }}
                onPress={() => {
                  dispatch({ type: 'NAVIGATE_TO_EXPIRING' });
                }}
              >
                <Bell size={24} color={expiringItems.length > 0 ? colors.danger : colors.textSecondary} />
                {expiringItems.length > 0 && (
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: colors.danger,
                      position: 'absolute',
                      top: 10,
                      right: 5,
                    }}
                  />
                )}
              </TouchableOpacity>
            }
          />
        </Animated.View>

        <CategoryCarousel
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
          getCategoryCount={getCategoryCount}
        />
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: Platform.OS == 'android' ? false : true,
        })}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: 56 + inset.top + 56,
          paddingBottom: 200,
          paddingHorizontal: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {state.loading ? (
          <View style={{ paddingTop: 24 }}>
            <EmptyStateUI title="로딩 중이에요..." />
          </View>
        ) : filteredIngredients.length === 0 ? (
          <View style={{ paddingTop: 24 }}>
            <EmptyStateUI
              title={selectedCategoryId === 0 ? '관리할 재료가 없어요' : `${selectedCategoryItem?.label} 재료가 없어요`}
              description="기억하고 싶은 재료만 추가해보세요"
            />
          </View>
        ) : (
          <IngredientsSection
            title={selectedCategoryId === 0 ? '전체 재료' : selectedCategoryItem?.label || ''}
            count={filteredIngredients.length}
            items={filteredIngredients}
            onCardPress={(item) => navigateIngredientDetail(item.id)}
            onCalendarPress={openDatePicker}
            getExpiryDisplay={getExpiryDisplay}
          />
        )}
      </Animated.ScrollView>

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
