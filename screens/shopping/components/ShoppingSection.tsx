import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Trash2, Package } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Card from '@/components/ui/Card';
import { ShoppingItem } from './ShoppingItem';
import { useMemo } from 'react';
import { ShoppingItem as ShoppingListItem } from '@/data/models/shopping.model';
import { Category } from '@/data/enums/category';

interface ShoppingSectionProps {
  title: string;
  items: ShoppingListItem[];
  onToggleItem: (id: string, isPurchased: boolean) => void;
  onDeleteItem: (id: string, name: string) => void;
  onMemoPress?: (id: string, currentMemo: string | null) => void;
  onAddToStorage?: (id: string, name: string, category: Category) => void;
  onClearAll: () => void;
  clearButtonText: string;
  isPurchasedSection?: boolean;
}

export function ShoppingSection({
  title,
  items,
  onToggleItem,
  onDeleteItem,
  onMemoPress,
  onAddToStorage,
  onClearAll,
  clearButtonText,
  isPurchasedSection = false,
}: ShoppingSectionProps) {
  const { colors, typography, spacing, borderRadius, isDark } = useTheme();

  const styles = useMemo(() => createStyles({ spacing, borderRadius }), [spacing, borderRadius]);

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>{title}</Text>
        <TouchableOpacity
          style={[
            styles.clearButton,
            {
              backgroundColor: isDark ? colors.surface : colors.textTertiary,
              borderColor: isDark ? colors.surface : colors.textTertiary,
              borderWidth: 1,
            },
          ]}
          onPress={onClearAll}
          activeOpacity={0.7}
        >
          {isPurchasedSection ? (
            <Package size={14} color={isDark ? colors.grey400 : colors.white} />
          ) : (
            <Trash2 size={14} color={isDark ? colors.grey400 : colors.white} />
          )}
          <Text style={[typography.styles.t7Medium, { color: isDark ? colors.grey400 : colors.white }]}>
            {clearButtonText}
          </Text>
        </TouchableOpacity>
      </View>
      <Card variant="elevated" padding="none">
        {items.map((item, index) => (
          <ShoppingItem
            key={item.id}
            id={String(item.id)}
            name={item.name}
            category={item.category}
            isPurchased={item.is_purchased}
            memo={item.memo}
            onToggle={() => onToggleItem(String(item.id), item.is_purchased)}
            onDelete={() => onDeleteItem(String(item.id), item.name)}
            onMemoPress={onMemoPress ? () => onMemoPress(String(item.id), item.memo) : undefined}
            onAddToStorage={
              onAddToStorage ? () => onAddToStorage(String(item.id), item.name, item.category) : undefined
            }
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
