import { View, Text, StyleSheet } from 'react-native';
import { ColorPalette, useTheme } from '@/lib/theme';
import { Ingredient } from '@/mvi/features/home';
import { IngredientCard } from './IngredientCard';
import { StatusType } from '@/data/enums/status';
import { useMemo } from 'react';

interface IngredientsSectionProps {
  title: string;
  count: number;
  items: Ingredient[];
  onCardPress: (item: Ingredient) => void;
  onCalendarPress: (item: Ingredient) => void;
  getExpiryDisplay: (status: StatusType, daysRemaining: number | null) => string;
}

export function IngredientsSection({
  title,
  count,
  items,
  onCardPress,
  onCalendarPress,
  getExpiryDisplay,
}: IngredientsSectionProps) {
  const { colors, typography, spacing } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>{title}</Text>
        <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>{count}개</Text>
      </View>
      <View style={styles.cardList}>
        {items.map((item) => (
          <IngredientCard
            key={item.id}
            item={item}
            onPress={() => onCardPress(item)}
            onCalendarPress={() => onCalendarPress(item)}
            getExpiryDisplay={getExpiryDisplay}
          />
        ))}
      </View>
    </View>
  );
}

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    section: {
      paddingTop: spacing.xxl,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    cardList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
  });
