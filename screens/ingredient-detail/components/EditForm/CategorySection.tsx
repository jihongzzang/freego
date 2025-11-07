import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';
import { CATEGORIES } from '@/constants/categories';
import { getCategoryIcon } from '@/utils/getCategoryIcons';
import { EditFormData } from '@/mvi/features/ingredient-detail';

interface CategorySectionProps {
  selectedCategory: string;
  onCategoryChange: (field: keyof EditFormData, value: string) => void;
}

export function CategorySection({ selectedCategory, onCategoryChange }: CategorySectionProps) {
  const { colors, typography, isDark, borderRadius } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>카테고리</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryBtn,
              {
                backgroundColor: isDark ? colors.grey400 : colors.grey200,
                borderColor: isDark ? colors.grey400 : colors.grey200,
                borderRadius: borderRadius.lg,
              },
              selectedCategory === cat.id && {
                backgroundColor: isDark ? colors.grey600 : colors.grey400,
                borderColor: isDark ? colors.grey600 : colors.grey400,
              },
            ]}
            onPress={() => onCategoryChange('category', cat.id)}
          >
            <View style={styles.categoryBtnContent}>
              {getCategoryIcon(cat.id, 18)}
              <Text
                style={[
                  typography.styles.t6,
                  { color: colors.grey700 },
                  selectedCategory === cat.id && {
                    color: isDark ? colors.text : colors.white,
                  },
                ]}
              >
                {cat.krLabel}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  scrollContent: {
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  categoryBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
