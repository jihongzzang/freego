import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';
import { Ingredient } from '@/mvi/features/home';
import { IngredientCard } from './IngredientCard';
import { StatusType } from '@/constants/itemStatus';
import { useMemo } from 'react';

interface ExpiringSectionProps {
  items: Ingredient[];
  onSeeMore: () => void;
  onCardPress: (item: Ingredient) => void;
  onCalendarPress: (item: Ingredient) => void;
  getExpiryDisplay: (status: StatusType, daysRemaining: number | null) => string;
}

export function ExpiringSection({
  items,
  onSeeMore,
  onCardPress,
  onCalendarPress,
  getExpiryDisplay,
}: ExpiringSectionProps) {
  const { colors, typography, spacing } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>소비기한 지남</Text>
        </View>
        {items.length > 8 && (
          <TouchableOpacity onPress={onSeeMore} activeOpacity={0.7}>
            <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>더보기</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.cardList}>
        {items.slice(0, 8).map((item) => (
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
    sectionHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    cardList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
  });
