import { View, Text, StyleSheet } from 'react-native';
import { ColorPalette, useTheme } from '@/lib/theme';
import { Ingredient } from '@/mvi/features/home';
import { SwipeableIngredientListItem } from './SwipeableIngredientListItem';
import { StatusType } from '@/data/enums/status';
import { useMemo } from 'react';

interface IngredientsSectionProps {
  title: string;
  count: number;
  items: Ingredient[];
  onCardPress: (item: Ingredient) => void;
  onCalendarPress: (item: Ingredient) => void;
  onDelete?: (item: Ingredient) => void;
  getExpiryDisplay: (status: StatusType, daysRemaining: number | null) => string;
}

export function IngredientsSection({
  title,
  count,
  items,
  onCardPress,
  onCalendarPress,
  onDelete,
  getExpiryDisplay,
}: IngredientsSectionProps) {
  const { colors, typography, spacing } = useTheme();

  const styles = useMemo(() => createStyles({ spacing, colors }), [spacing, colors]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>{title}</Text>
        <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>{count}개</Text>
      </View>
      <View style={styles.listContainer}>
        {items.map((item) => (
          <SwipeableIngredientListItem
            key={item.id}
            item={item}
            onPress={() => onCardPress(item)}
            onCalendarPress={() => onCalendarPress(item)}
            onDelete={onDelete ? () => onDelete(item) : undefined}
            getExpiryDisplay={getExpiryDisplay}
          />
        ))}
      </View>
    </View>
  );
}

const createStyles = ({ spacing, colors }: { spacing: typeof import('@/lib/theme').spacing; colors: any }) =>
  StyleSheet.create({
    section: {
      paddingTop: spacing.xxl,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    listContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      overflow: 'hidden',
    },
  });
