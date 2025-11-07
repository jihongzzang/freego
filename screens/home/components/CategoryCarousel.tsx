import { View, ScrollView, StyleSheet } from 'react-native';
import { ColorPalette, useTheme } from '@/lib/theme';
import { ALL_CATEGORIES, AllCategoryType } from '@/constants/categories';
import Chip from '@/components/ui/Chip';
import { useMemo } from 'react';

interface CategoryCarouselProps {
  selectedCategoryId: AllCategoryType;
  onCategorySelect: (categoryId: AllCategoryType) => void;
  getCategoryCount: (categoryId: AllCategoryType) => number;
}

export function CategoryCarousel({ selectedCategoryId, onCategorySelect, getCategoryCount }: CategoryCarouselProps) {
  const { colors, spacing, isDark } = useTheme();

  const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {ALL_CATEGORIES.map((categoryItem) => {
          const isSelected = categoryItem.id === selectedCategoryId;

          return (
            <Chip
              key={categoryItem.id}
              label={categoryItem.krLabel}
              selected={isSelected}
              onPress={() => onCategorySelect(categoryItem.id)}
              variant={'filled'}
              size="medium"
              selectedColor={isDark ? colors.grey600 : colors.grey400}
              backgroundColor={isDark ? colors.grey400 : colors.grey200}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = ({ colors, spacing }: { colors: ColorPalette; spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      backgroundColor: colors.surface,
      borderBottomColor: colors.borderLight,
    },
    scrollView: {
      flexGrow: 0,
    },
    scrollContent: {
      gap: spacing.sm,
    },
  });
