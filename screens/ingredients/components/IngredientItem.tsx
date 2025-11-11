import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Edit3, Trash2, ShoppingCart } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { Ingredient } from '@/mvi/features/ingredients';
import { getStatusColor } from '@/utils/status/getStatusColor';
import { getStorageLocationLabel } from '@/utils/storageLocation';
import { getUnitLabel } from '@/utils/unit';
import { useMemo } from 'react';
import { getDaysRemaining } from '@/utils/time';

interface IngredientItemProps {
  item: Ingredient;
  onPress: () => void;
  onEdit: () => void;
  onQuickAdd: () => void;
  onQuickDelete: () => void;
}

export function IngredientItem({ item, onPress, onEdit, onQuickAdd, onQuickDelete }: IngredientItemProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const styles = useMemo(() => createStyles({ spacing, borderRadius }), [spacing, borderRadius]);

  const getIngredientDetails = useMemo(() => {
    const parts: string[] = [];

    // 수량과 단위 (둘 다 있어야 표시)
    if (item.quantity && item.unit) {
      parts.push(`${item.quantity}${getUnitLabel({ unit: item.unit, lang: 'kr' })}`);
    }

    // 보관 위치
    if (item.storage_location) {
      parts.push(getStorageLocationLabel({ storageLocation: item.storage_location, lang: 'kr' }));
    }

    return parts.length > 0 ? parts.join(' · ') : null;
  }, [item.quantity, item.unit, item.storage_location]);

  return (
    <View style={styles.ingredientItem}>
      <TouchableOpacity style={styles.ingredientLeft} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.ingredientInfo}>
          <View style={styles.ingredientNameRow}>
            <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>{item.name}</Text>

            {(item.status === 'warning' || item.status === 'expired') && (
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            )}
          </View>
          {getIngredientDetails && (
            <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>{getIngredientDetails}</Text>
          )}
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
          style={[styles.actionButton]}
          onPress={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          activeOpacity={0.7}
        >
          <Edit3 size={20} color={colors.blue500} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton]}
          onPress={(e) => {
            e.stopPropagation();
            onQuickAdd();
          }}
          activeOpacity={0.7}
        >
          <ShoppingCart size={20} color={colors.teal500} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton]}
          onPress={(e) => {
            e.stopPropagation();
            onQuickDelete();
          }}
          activeOpacity={0.7}
        >
          <Trash2 size={20} color={colors.red500} />
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
