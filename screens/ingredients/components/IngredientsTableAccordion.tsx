import { View, StyleSheet, Text } from 'react-native';
import Accordion from '@/components/ui/Accordion';
import EmptyStateUI from '@/components/ui/EmptyState';
import { Ingredient } from '@/mvi/features/ingredients';
import { IngredientsTableRow } from './IngredientsTableRow';
import { useTheme } from '@/lib/theme';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface IngredientsTableAccordionProps {
  title: string;
  leftIcon: React.ReactNode;
  items: Ingredient[];
  isExpanded: boolean;
  onToggle: () => void;
  onQuickAdd: (id: string) => void;
  onQuickConsume: (id: string) => void;
  onQuickDelete: (id: string) => void;
  onQuickUpdateEmoji: (id: string) => void;
  onQuickUpdateName: (id: string) => void;
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
  onQuickAdd,
  onQuickConsume,
  onQuickDelete,
  onQuickUpdateEmoji,
  onQuickUpdateName,
  onQuickUpdateExpiry,
  onQuickUpdateQuantity,
  onQuickUpdateStorage,
  onQuickUpdateMemo,
  onViewDetail,
}: IngredientsTableAccordionProps) {
  const { t } = useTranslation();
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
        <View style={styles.tableWrapper}>
          {/* Header */}
          <View style={[styles.headerRow]}>
            <View style={[styles.cell, styles.emojiCell]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}> </Text>
            </View>
            <View style={[styles.cell, styles.nameCell]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>
                {t('ingredients.tableHeader.name')}
              </Text>
            </View>
            <View style={[styles.cell, styles.expiryCell]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary, textAlign: 'center' }]}>
                {t('ingredients.tableHeader.expiry')}
              </Text>
            </View>
            <View style={[styles.cell, styles.quantityCell]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary, textAlign: 'center' }]}>
                {t('ingredients.tableHeader.quantity')}
              </Text>
            </View>
            <View style={[styles.cell, styles.storageCell]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary, textAlign: 'center' }]}>
                {t('ingredients.tableHeader.storage')}
              </Text>
            </View>

            <View style={[styles.cell, styles.memoCell]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary, textAlign: 'center' }]}>
                {t('ingredients.tableHeader.memo')}
              </Text>
            </View>
          </View>

          {/* Data Rows */}
          {items.map((item) => (
            <IngredientsTableRow
              key={item.id}
              item={item}
              onQuickUpdateEmoji={() => onQuickUpdateEmoji(String(item.id))}
              onQuickUpdateName={() => onQuickUpdateName(String(item.id))}
              onQuickUpdateExpiry={() => onQuickUpdateExpiry(String(item.id))}
              onQuickUpdateQuantity={() => onQuickUpdateQuantity(String(item.id))}
              onQuickUpdateStorage={() => onQuickUpdateStorage(String(item.id))}
              onQuickUpdateMemo={() => onQuickUpdateMemo(String(item.id))}
              onQuickAdd={() => onQuickAdd(String(item.id))}
              onQuickConsume={() => onQuickConsume(String(item.id))}
              onQuickDelete={() => onQuickDelete(String(item.id))}
              onViewDetail={() => onViewDetail(String(item.id))}
            />
          ))}
        </View>
      ) : (
        <EmptyStateUI title={t('ingredients.empty.categoryEmpty')} description={t('ingredients.empty.description')} />
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
      overflow: 'hidden',
      flexDirection: 'column',
      gap: spacing.sm,
    },

    headerRow: {
      flexDirection: 'row',
      paddingHorizontal: spacing.xs,
    },

    cell: {
      justifyContent: 'center',
      paddingHorizontal: spacing.sm,
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
      width: 40,
    },

    storageCell: {
      width: 40,
    },

    expiryCell: {
      width: 62,
      alignItems: 'center',
    },

    memoCell: {
      width: 40,
      alignItems: 'center',
    },
  });
