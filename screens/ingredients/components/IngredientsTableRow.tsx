import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Edit3, ShoppingCart, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { Ingredient } from '@/mvi/features/ingredients';
import { getStorageLocationLabel } from '@/utils/storageLocation';
import { calculateDday, getDdayColor } from '@/utils/date/calculateDday';
import { useMemo } from 'react';

interface IngredientsTableRowProps {
  item: Ingredient;
  onPress: () => void;
  onEdit?: () => void;
  onQuickAdd?: () => void;
  onQuickDelete?: () => void;
  isLast?: boolean;
}

export function IngredientsTableRow({
  item,
  onPress,
  onEdit,
  onQuickAdd,
  onQuickDelete,
  isLast,
}: IngredientsTableRowProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const dday = calculateDday(item.expiry_date);
  const ddayColorType = getDdayColor(dday);
  const ddayColor =
    ddayColorType === 'danger' ? colors.red500 : ddayColorType === 'warning' ? colors.orange500 : colors.green500;

  const storageLabel = item.storage_location
    ? getStorageLocationLabel({ storageLocation: item.storage_location, lang: 'kr' })
    : '-';

  const styles = useMemo(
    () => createStyles({ spacing, borderRadius, isLast: isLast || false }),
    [spacing, borderRadius, isLast],
  );

  return (
    <TouchableOpacity
      style={[
        styles.row,
        {
          borderBottomColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Name Cell */}
      <View style={[styles.cell, styles.nameCell]}>
        <Text
          style={[
            typography.styles.t7Semibold,
            {
              color: colors.text,
              fontSize: 13,
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
      </View>

      {/* Storage Cell */}
      <View style={[styles.cell, styles.storageCell]}>
        <Text
          style={[
            typography.styles.t7,
            {
              color: colors.textSecondary,
              fontSize: 12,
            },
          ]}
          numberOfLines={1}
        >
          {storageLabel}
        </Text>
      </View>

      {/* D-day Cell */}
      <View style={[styles.cell, styles.ddayCell]}>
        <Text
          style={[
            typography.styles.t7Semibold,
            {
              color: ddayColor,
              fontSize: 12,
            },
          ]}
          numberOfLines={1}
        >
          {dday}
        </Text>
      </View>

      {/* Action Cell */}
      <View style={[styles.cell, styles.actionCell]}>
        <View style={styles.actionButtons}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              activeOpacity={0.7}
            >
              <Edit3 size={16} color={colors.blue500} />
            </TouchableOpacity>
          )}
          {onQuickAdd && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onQuickAdd();
              }}
              activeOpacity={0.7}
            >
              <ShoppingCart size={16} color={colors.teal500} />
            </TouchableOpacity>
          )}
          {onQuickDelete && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onQuickDelete();
              }}
              activeOpacity={0.7}
            >
              <Trash2 size={16} color={colors.red500} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
    row: {
      flexDirection: 'row',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xs,
      borderBottomWidth: isLast ? 0 : 1,
      minHeight: 48,
      alignItems: 'center',
    },
    cell: {
      justifyContent: 'center',
      paddingHorizontal: spacing.xs,
    },
    nameCell: {
      flex: 1,
      minWidth: 80,
    },
    storageCell: {
      width: 60,
    },
    ddayCell: {
      width: 50,
      alignItems: 'center',
    },
    actionCell: {
      width: 90,
      alignItems: 'center',
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    actionButton: {
      padding: 4,
    },
  });
