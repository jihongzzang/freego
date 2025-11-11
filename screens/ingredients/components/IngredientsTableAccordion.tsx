import { View, StyleSheet } from 'react-native';
import Accordion from '@/components/ui/Accordion';
import EmptyStateUI from '@/components/ui/EmptyState';
import { Ingredient } from '@/mvi/features/ingredients';
import { IngredientsTableRow } from './IngredientsTableRow';
import { useTheme } from '@/lib/theme';
import { Text } from 'react-native';
import { useMemo } from 'react';

interface IngredientsTableAccordionProps {
  title: string;
  leftIcon: React.ReactNode;
  items: Ingredient[];
  isExpanded: boolean;
  onToggle: () => void;
  onItemPress: (id: string) => void;
  onItemEdit: (id: string) => void;
  onQuickAdd: (id: string) => void;
  onQuickDelete: (id: string) => void;
}

export function IngredientsTableAccordion({
  title,
  leftIcon,
  items,
  isExpanded,
  onToggle,
  onItemPress,
  onItemEdit,
  onQuickAdd,
  onQuickDelete,
}: IngredientsTableAccordionProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const styles = useMemo(() => createStyles({ spacing, borderRadius }), [spacing, borderRadius]);

  return (
    <Accordion
      title={title}
      leftIcon={leftIcon}
      badge={
        items.length > 0 ? (
          <Text style={[typography.styles.t7Bold, { color: colors.textSecondary }]}>{items.length}</Text>
        ) : undefined
      }
      defaultExpanded={isExpanded}
      onToggle={onToggle}
    >
      {items.length > 0 ? (
        <View style={styles.tableContainer}>
          {items.map((item, index) => (
            <IngredientsTableRow
              key={item.id}
              item={item}
              onPress={() => onItemPress(String(item.id))}
              onEdit={() => onItemEdit(String(item.id))}
              onQuickAdd={() => onQuickAdd(String(item.id))}
              onQuickDelete={() => onQuickDelete(String(item.id))}
              isLast={index === items.length - 1}
            />
          ))}
        </View>
      ) : (
        <EmptyStateUI title="재료가 없어요" />
      )}
    </Accordion>
  );
}

const createStyles = ({
  spacing,
  borderRadius,
}: {
  spacing: typeof import('@/lib/theme').spacing;
  borderRadius: typeof import('@/lib/theme').borderRadius;
}) =>
  StyleSheet.create({
    tableContainer: {
      // backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
    },
  });
