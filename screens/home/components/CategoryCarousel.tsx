import { View, ScrollView, StyleSheet } from 'react-native';
import { ColorPalette, useTheme } from '@/lib/theme';
import { Category } from '@/data/enums/category';
import { makeCategoryList } from '@/utils/category/makeCategoryList';
import Chip from '@/components/ui/Chip';
import { useMemo, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';

interface CategoryCarouselProps {
  isIncludeAllCategory: boolean;
  selectedCategoryId: Category;
  onCategorySelect: (categoryId: Category) => void;
}

export interface CategoryCarouselRef {
  scrollToCategory: (categoryId: Category) => void;
}

export const CategoryCarousel = forwardRef<CategoryCarouselRef, CategoryCarouselProps>(
  ({ isIncludeAllCategory, selectedCategoryId, onCategorySelect }, ref) => {
    const { colors, spacing } = useTheme();
    const scrollViewRef = useRef<ScrollView>(null);
    const chipRefs = useRef<{ [key: string]: View | null }>({});

    const categories = useMemo(
      () => makeCategoryList({ includeAllCategory: isIncludeAllCategory, lang: 'kr' }),
      [isIncludeAllCategory],
    );

    const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);

    const scrollToCategory = (categoryId: Category) => {
      const categoryIndex = categories.findIndex((cat) => cat.id === categoryId);
      if (categoryIndex !== -1 && chipRefs.current[categoryId]) {
        chipRefs.current[categoryId]?.measureLayout(
          scrollViewRef.current as any,
          (x: number) => {
            scrollViewRef.current?.scrollTo({ x: Math.max(0, x - 20), animated: true });
          },
          () => {},
        );
      }
    };

    useImperativeHandle(ref, () => ({
      scrollToCategory,
    }));

    // 선택된 카테고리로 자동 스크롤
    useEffect(() => {
      scrollToCategory(selectedCategoryId);
    }, [selectedCategoryId]);

    return (
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {categories.map((categoryItem) => {
            const isSelected = categoryItem.id === selectedCategoryId;

            return (
              <View
                key={categoryItem.id}
                ref={(el) => {
                  chipRefs.current[categoryItem.id] = el;
                }}
                collapsable={false}
              >
                <Chip
                  label={categoryItem.label}
                  onPress={() => onCategorySelect(categoryItem.id)}
                  variant={isSelected ? 'primary' : 'secondary'}
                  color={isSelected ? 'green' : 'grey'}
                  size="xlarge"
                />
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  },
);

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
