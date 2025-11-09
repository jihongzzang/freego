import { View, ScrollView, StyleSheet } from 'react-native';
import { ColorPalette, useTheme } from '@/lib/theme';
import { Category } from '@/data/enums/category';
import { makeCategoryList } from '@/utils/category/makeCategoryList';
import Chip from '@/components/ui/Chip';
import { useMemo } from 'react';
import { getCategoryIcon } from '@/utils/category';

interface CategoryCarouselProps {
  selectedCategoryId: Category | 0;
  onCategorySelect: (categoryId: Category | 0) => void;
  getCategoryCount: (categoryId: Category | 0) => number;
}

export function CategoryCarousel({ selectedCategoryId, onCategorySelect }: CategoryCarouselProps) {
  const { colors, spacing } = useTheme();

  const categories = useMemo(() => makeCategoryList({ includeAllCategory: true, lang: 'kr' }), []);

  const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((categoryItem) => {
          const isSelected = categoryItem.id === selectedCategoryId;

          return (
            <Chip
              key={categoryItem.id}
              label={categoryItem.label}
              onPress={() => onCategorySelect(categoryItem.id)}
              variant={isSelected ? 'primary' : 'secondary'}
              color={isSelected ? 'green' : 'grey'}
              size="xlarge"
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
      borderBottomColor: colors.border,
    },
    scrollView: {
      flexGrow: 0,
    },
    scrollContent: {
      gap: spacing.sm,
    },
  });
