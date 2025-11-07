import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Card from '@/components/ui/Card';
import { ShoppingItem } from './ShoppingItem';
import { useMemo } from 'react';

export interface ShoppingListItem {
  id: string;
  name: string;
  category: string;
  is_purchased: boolean;
}

interface ShoppingSectionProps {
  title: string;
  items: ShoppingListItem[];
  onToggleItem: (id: string, isPurchased: boolean) => void;
  onDeleteItem: (id: string, name: string) => void;
  onClearAll: () => void;
  clearButtonText: string;
}

export function ShoppingSection({
  title,
  items,
  onToggleItem,
  onDeleteItem,
  onClearAll,
  clearButtonText,
}: ShoppingSectionProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const styles = useMemo(() => createStyles({ spacing, borderRadius }), [spacing, borderRadius]);

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>{title}</Text>
        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: colors.dangerLight }]}
          onPress={onClearAll}
          activeOpacity={0.7}
        >
          <Trash2 size={14} color={colors.danger} />
          <Text style={[typography.styles.t7Bold, { color: colors.danger }]}>{clearButtonText}</Text>
        </TouchableOpacity>
      </View>
      <Card variant="elevated" padding="none">
        {items.map((item, index) => (
          <ShoppingItem
            key={item.id}
            id={item.id}
            name={item.name}
            category={item.category}
            isPurchased={item.is_purchased}
            onToggle={() => onToggleItem(item.id, item.is_purchased)}
            onDelete={() => onDeleteItem(item.id, item.name)}
            isLast={index === items.length - 1}
          />
        ))}
      </Card>
    </View>
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
    section: {
      marginBottom: spacing.xxl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    clearButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
    },
  });
