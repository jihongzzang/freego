import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';
import { getCategoryIcon } from '@/utils/category';
import { EditFormData } from '@/mvi/features/ingredient-detail';
import { makeCategoryList } from '@/utils/category/makeCategoryList';
import { Category } from '@/data/enums/category';
import { useMemo } from 'react';
import { Chip } from '@/components/ui';

interface CategorySectionProps {
  selectedCategory: Category;
  onCategoryChange: (field: keyof EditFormData, value: Category) => void;
}

export function CategorySection({ selectedCategory, onCategoryChange }: CategorySectionProps) {
  const { colors, typography, spacing, isDark, borderRadius } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={styles.container}>
      <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>카테고리</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {makeCategoryList({}).map((cat) => (
          <Chip
            key={cat.id}
            label={cat.label}
            onPress={() => onCategoryChange('category', cat.id)}
            variant={selectedCategory === cat.id ? 'primary' : 'secondary'}
            color={selectedCategory === cat.id ? 'green' : 'grey'}
            size="xlarge"
            leftIcon={cat.id !== Category.ALL && getCategoryIcon(cat.id, 18)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    container: {
      gap: spacing.sm,
    },
    scrollContent: {
      gap: spacing.sm,
    },
    categoryBtn: {
      paddingHorizontal: 10,
      paddingVertical: spacing.xs,
      borderWidth: 1,
    },
    categoryBtnContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
  });
