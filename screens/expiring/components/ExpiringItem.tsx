import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Minus } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { getCategoryIcon } from '@/utils/category';
import { getStatusColor, getCalculateStatus } from '@/utils/status';
import Badge from '@/components/ui/Badge';
import { useMemo } from 'react';
import { Ingredient } from '@/mvi/features/expiring/types';
import { getDaysRemaining } from '@/utils/time';

interface ExpiringItemProps {
  item: Ingredient;
  onPress: () => void;
  onQuickDeduct: () => void;
}

export function ExpiringItem({ item, onPress, onQuickDeduct }: ExpiringItemProps) {
  const { colors, typography, spacing, borderRadius, isDark } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <View style={[styles.categoryIconWrapper, { backgroundColor: isDark ? colors.grey800 : colors.grey200 }]}>
          {item.emoji ? <Text style={typography.styles.t7}>{item.emoji}</Text> : getCategoryIcon(item.category, 20)}
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>{item.name}</Text>
            <Badge
              dot
              variant="primary"
              style={{ backgroundColor: getStatusColor(getCalculateStatus(item.expiry_date)) }}
            />
          </View>
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

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.lg,
    },
    left: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
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
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    quickButton: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
