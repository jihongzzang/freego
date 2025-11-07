import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Minus } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { Ingredient } from '@/mvi/features/expiring';
import { getCategoryIcon } from '@/utils/getCategoryIcons';
import { getStatusColor } from '@/utils/getStatusColors';
import { findStorageLocationById } from '@/constants/storageLocations';
import { findUnitById } from '@/constants/units';
import Badge from '@/components/ui/Badge';

interface ExpiringItemProps {
  item: Ingredient;
  onPress: () => void;
  onQuickDeduct: () => void;
  getDaysRemaining: (daysRemaining: number | null) => string;
}

export function ExpiringItem({ item, onPress, onQuickDeduct, getDaysRemaining }: ExpiringItemProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <View style={[styles.categoryIconWrapper, { backgroundColor: colors.surfaceSecondary }]}>
          {item.emoji ? <Text style={typography.styles.t7}>{item.emoji}</Text> : getCategoryIcon(item.category, 20)}
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>{item.name}</Text>
            <Badge dot variant="primary" style={{ backgroundColor: getStatusColor(item.status) }} />
          </View>
          <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>
            <>
              {item.quantity && item.unit && (
                <>
                  {item.quantity}
                  {item.unit && findUnitById(item.unit)?.krLabel}
                  {' · '}
                  {findStorageLocationById(item.storage_location)?.krLabel}
                </>
              )}

              {item.daysRemaining !== null && (
                <>
                  {item.quantity && item.unit && ' · '}
                  {getDaysRemaining(item.daysRemaining)}
                </>
              )}
            </>
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.quickButton, { backgroundColor: colors.surfaceSecondary, borderRadius: borderRadius.lg }]}
        onPress={(e) => {
          e.stopPropagation();
          onQuickDeduct();
        }}
      >
        <Minus size={16} color={colors.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  quickButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
