import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { getCategoryColor } from '@/utils/getCategoryColors';
import { findCategoryById } from '@/constants/categories';
import { useMemo } from 'react';

interface ShoppingItemProps {
  id: string;
  name: string;
  category: string;
  isPurchased: boolean;
  onToggle: () => void;
  onDelete: () => void;
  isLast?: boolean;
}

export function ShoppingItem({ name, category, isPurchased, onToggle, onDelete, isLast }: ShoppingItemProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const styles = useMemo(
    () => createStyles({ spacing, borderRadius, isLast: isLast || false }),
    [spacing, borderRadius, isLast],
  );

  return (
    <View style={[styles.itemRow, { borderBottomColor: colors.border }]}>
      <TouchableOpacity style={styles.itemContent} onPress={onToggle} activeOpacity={0.7}>
        <View
          style={[
            styles.checkbox,
            {
              borderColor: isPurchased ? colors.primary : colors.border,
              backgroundColor: isPurchased ? colors.primary : colors.background,
            },
          ]}
        >
          {isPurchased && <Check size={16} color={colors.white} />}
        </View>
        <View style={styles.itemInfo}>
          <Text
            style={[
              typography.styles.t5Semibold,
              {
                color: isPurchased ? colors.textTertiary : colors.text,
                textDecorationLine: isPurchased ? 'line-through' : 'none',
              },
            ]}
          >
            {name}
          </Text>
          <View style={styles.itemMeta}>
            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor: getCategoryColor(category) + '20',
                },
              ]}
            >
              <Text style={[typography.styles.t7Bold, { color: getCategoryColor(category) }]}>
                {findCategoryById(category)?.krLabel}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {!isPurchased && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete} activeOpacity={0.7}>
          <Trash2 size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = ({
  spacing,
  borderRadius,
  isLast,
}: {
  spacing: typeof import('@/lib/theme').spacing;
  borderRadius: typeof import('@/lib/theme').borderRadius;
  isLast: boolean;
}) =>
  StyleSheet.create({
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: isLast ? 0 : 1,
    },
    itemContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: borderRadius.md,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemInfo: {
      flex: 1,
      gap: spacing.xs,
    },
    itemMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    categoryBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
    },
    deleteButton: {
      padding: spacing.sm,
    },
  });
