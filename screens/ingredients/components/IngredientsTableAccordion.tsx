import { View, StyleSheet, Text } from 'react-native';
import Accordion from '@/components/ui/Accordion';
import EmptyStateUI from '@/components/ui/EmptyState';
import { Ingredient } from '@/mvi/features/ingredients';
import { IngredientsTableRow } from './IngredientsTableRow';
import { useTheme } from '@/lib/theme';
import { useMemo } from 'react';

interface IngredientsTableAccordionProps {
  title: string;
  leftIcon: React.ReactNode;
  items: Ingredient[];
  isExpanded: boolean;
  onToggle: () => void;
  onItemEdit: (id: string) => void;
  onQuickAdd: (id: string) => void;
  onQuickDelete: (id: string) => void;
  onQuickUpdateEmoji: (id: string) => void;
  onQuickUpdateExpiry: (id: string) => void;
  onQuickUpdateQuantity: (id: string) => void;
  onQuickUpdateStorage: (id: string) => void;
  onQuickUpdateMemo: (id: string) => void;
  onViewDetail: (id: string) => void;
}

export function IngredientsTableAccordion({
  title,
  leftIcon,
  items,
  isExpanded,
  onToggle,
  onItemEdit,
  onQuickAdd,
  onQuickDelete,
  onQuickUpdateEmoji,
  onQuickUpdateExpiry,
  onQuickUpdateQuantity,
  onQuickUpdateStorage,
  onQuickUpdateMemo,
  onViewDetail,
}: IngredientsTableAccordionProps) {
  const { colors, typography, spacing, borderRadius, isDark } = useTheme();

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
          {/* Header */}
          <View
            style={[
              styles.headerRow,
              { backgroundColor: isDark ? colors.grey900 : colors.surface, borderBottomColor: colors.border },
            ]}
          >
            <View style={[styles.cell, styles.emojiCell, { borderRightWidth: 1, borderRightColor: colors.border }]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}> </Text>
            </View>
            <View style={[styles.cell, styles.nameCell, { borderRightWidth: 1, borderRightColor: colors.border }]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>이름</Text>
            </View>
            <View style={[styles.cell, styles.quantityCell, { borderRightWidth: 1, borderRightColor: colors.border }]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary, textAlign: 'center' }]}>
                수량
              </Text>
            </View>
            <View style={[styles.cell, styles.storageCell, { borderRightWidth: 1, borderRightColor: colors.border }]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary, textAlign: 'center' }]}>
                보관
              </Text>
            </View>
            <View style={[styles.cell, styles.expiryCell, { borderRightWidth: 1, borderRightColor: colors.border }]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary, textAlign: 'center' }]}>
                유통기한
              </Text>
            </View>
            <View style={[styles.cell, styles.memoCell]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary, textAlign: 'center' }]}>
                메모
              </Text>
            </View>
          </View>

          {/* Data Rows */}
          {items.map((item, index) => (
            <IngredientsTableRow
              key={item.id}
              item={item}
              onEdit={() => onItemEdit(String(item.id))}
              onQuickUpdateEmoji={() => onQuickUpdateEmoji(String(item.id))}
              onQuickUpdateExpiry={() => onQuickUpdateExpiry(String(item.id))}
              onQuickUpdateQuantity={() => onQuickUpdateQuantity(String(item.id))}
              onQuickUpdateStorage={() => onQuickUpdateStorage(String(item.id))}
              onQuickUpdateMemo={() => onQuickUpdateMemo(String(item.id))}
              onQuickAdd={() => onQuickAdd(String(item.id))}
              onQuickDelete={() => onQuickDelete(String(item.id))}
              onViewDetail={() => onViewDetail(String(item.id))}
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
    tableWrapper: {
      borderRadius: 4,
      overflow: 'hidden',
    },
    headerRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      // paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xs,
    },
    cell: {
      justifyContent: 'center',
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.sm,
    },
    emojiCell: {
      width: 32,
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
