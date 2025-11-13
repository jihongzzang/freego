import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/lib/theme';
import { Ingredient } from '@/mvi/features/home';
import { IngredientCard } from './IngredientCard';
import { StatusType } from '@/data/enums/status';
import { useMemo } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 12) / 2; // padding(24*2) + gap(12)

interface CategorySectionProps {
  title: string;
  count: number;
  items: Ingredient[];
  onCardPress: (item: Ingredient) => void;
  onCalendarPress: (item: Ingredient) => void;
  getExpiryDisplay: (status: StatusType, daysRemaining: number | null) => string;
}

export function CategorySection({
  title,
  count,
  items,
  onCardPress,
  onCalendarPress,
  getExpiryDisplay,
}: CategorySectionProps) {
  const { colors, typography, spacing } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[typography.styles.t5Bold, { color: colors.text }]}>{title}</Text>
        <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>{count}개</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + spacing.md}
        decelerationRate="fast"
      >
        {items.map((item) => (
          <View key={item.id} style={{ width: CARD_WIDTH }}>
            <IngredientCard
              item={item}
              onPress={() => onCardPress(item)}
              onCalendarPress={() => onCalendarPress(item)}
              getExpiryDisplay={getExpiryDisplay}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    section: {
      marginBottom: spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      gap: spacing.md,
    },
  });
