import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Edit3 } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { Ingredient } from '@/mvi/features/ingredients';
import { getStatusColor } from '@/utils/getStatusColors';
import { findStorageLocationById } from '@/constants/storageLocations';
import { findUnitById } from '@/constants/units';
import { useMemo } from 'react';

interface IngredientItemProps {
  item: Ingredient;
  onPress: () => void;
  onEdit: () => void;
  onQuickDeduct: () => void;
  getDaysRemaining: (daysRemaining: number | null) => string;
}

export function IngredientItem({ item, onPress, onEdit, onQuickDeduct, getDaysRemaining }: IngredientItemProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const styles = useMemo(() => createStyles({ spacing, borderRadius }), [spacing, borderRadius]);

  return (
    <View style={styles.ingredientItem}>
      <TouchableOpacity style={styles.ingredientLeft} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.ingredientInfo}>
          <View style={styles.ingredientNameRow}>
            <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>{item.name}</Text>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          </View>
          <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>
            {item.quantity
              ? item.unit
                ? `${item.quantity}${findUnitById(item.unit)?.krLabel}${item.storage_location ? ` · ${findStorageLocationById(item.storage_location)?.krLabel}` : ''}`
                : `${item.quantity}${item.storage_location ? ` · ${findStorageLocationById(item.storage_location)?.krLabel}` : ''}`
              : item.storage_location
                ? findStorageLocationById(item.storage_location)?.krLabel
                : ''}
          </Text>

          {item.expiry_date ? (
            <Text
              style={[
                typography.styles.t7,
                {
                  color: getStatusColor(item.status),
                  marginTop: spacing.xs,
                },
              ]}
            >
              유통기한: {item.expiry_date}
              {item.daysRemaining !== null && ` (${getDaysRemaining(item.daysRemaining)})`}
            </Text>
          ) : (
            <Text
              style={[
                typography.styles.t7,
                {
                  color: colors.textTertiary,
                  marginTop: spacing.xs,
                },
              ]}
            >
              유통기한 입력 필요
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surfaceSecondary }]}
          onPress={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          activeOpacity={0.7}
        >
          <Edit3 size={16} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surfaceSecondary }]}
          onPress={(e) => {
            e.stopPropagation();
            onQuickDeduct();
          }}
          activeOpacity={0.7}
        >
          <Minus size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
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
    ingredientItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.lg,
    },
    ingredientLeft: {
      flex: 1,
    },
    ingredientInfo: {
      flex: 1,
    },
    ingredientNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    actionButton: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.xl,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
