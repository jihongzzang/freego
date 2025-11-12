import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';
import { Ingredient } from '@/mvi/features/ingredients';
import { IngredientsTableRow } from './IngredientsTableRow';
import { useMemo } from 'react';

interface IngredientsTableViewProps {
  title: string;
  leftIcon: React.ReactNode;
  items: Ingredient[];
  onItemPress: (id: string) => void;
  onItemEdit: (id: string) => void;
  onQuickAdd: (id: string) => void;
  onQuickDelete: (id: string) => void;
  onQuickUpdateExpiry: (id: string) => void;
  onQuickUpdateQuantity: (id: string) => void;
  onQuickUpdateStorage: (id: string) => void;
  onViewDetail: (id: string) => void;
}

export function IngredientsTableView({
  title,
  leftIcon,
  items,
  onItemPress,
  onItemEdit,
  onQuickAdd,
  onQuickDelete,
  onQuickUpdateExpiry,
  onQuickUpdateQuantity,
  onQuickUpdateStorage,
  onViewDetail,
}: IngredientsTableViewProps) {
  const { colors, typography, spacing, borderRadius, isDark } = useTheme();

  const styles = useMemo(() => createStyles({ spacing, borderRadius }), [spacing, borderRadius]);

  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          {leftIcon}
          <Text style={[typography.styles.t6Bold, { color: colors.text, marginLeft: spacing.sm }]}>{title}</Text>
          <Text style={[typography.styles.t7Bold, { color: colors.textSecondary, marginLeft: spacing.xs }]}>
            {items.length}
          </Text>
        </View>
      </View>

      {/* Table */}
      <View
        style={[
          styles.tableWrapper,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
          },
        ]}
      >
        <View>
          {/* Header */}
          <View
            style={[
              styles.headerRow,
              { backgroundColor: isDark ? colors.grey900 : colors.grey50, borderBottomColor: colors.border },
            ]}
          >
            <View style={[styles.cell, styles.emojiCell, { borderRightWidth: 1, borderRightColor: colors.border }]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}></Text>
            </View>
            <View style={[styles.cell, styles.nameCell, { borderRightWidth: 1, borderRightColor: colors.border }]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>이름</Text>
            </View>
            <View style={[styles.cell, styles.quantityCell, { borderRightWidth: 1, borderRightColor: colors.border }]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>수량</Text>
            </View>
            <View style={[styles.cell, styles.storageCell, { borderRightWidth: 1, borderRightColor: colors.border }]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>보관</Text>
            </View>
            <View style={[styles.cell, styles.expiryCell, { borderRightWidth: 1, borderRightColor: colors.border }]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>유통기한</Text>
            </View>
            <View style={[styles.cell, styles.memoCell]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>메모</Text>
            </View>
          </View>

          {/* Data Rows */}
          {items.map((item, index) => (
            <IngredientsTableRow
              key={item.id}
              item={item}
              onPress={() => onItemPress(String(item.id))}
              onEdit={() => onItemEdit(String(item.id))}
              onQuickUpdateExpiry={() => onQuickUpdateExpiry(String(item.id))}
              onQuickUpdateQuantity={() => onQuickUpdateQuantity(String(item.id))}
              onQuickUpdateStorage={() => onQuickUpdateStorage(String(item.id))}
              onQuickAdd={() => onQuickAdd(String(item.id))}
              onQuickDelete={() => onQuickDelete(String(item.id))}
              onViewDetail={() => onViewDetail(String(item.id))}
              isLast={index === items.length - 1}
            />
          ))}
        </View>
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
    container: {
      marginBottom: spacing.xxl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tableWrapper: {
      borderRadius: borderRadius.sm,
      overflow: 'hidden',
    },
    headerRow: {
      flexDirection: 'row',
      borderBottomWidth: 2,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xs,
    },
    cell: {
      justifyContent: 'center',
      paddingHorizontal: spacing.xs,
    },
    emojiCell: {
      width: 24,
      alignItems: 'center',
    },
    nameCell: {
      flex: 1,
      minWidth: 80,
    },
    quantityCell: {
      width: 60,
    },
    storageCell: {
      width: 60,
    },
    expiryCell: {
      width: 60,
      alignItems: 'center',
    },
    memoCell: {
      width: 40,
      alignItems: 'center',
    },
  });
