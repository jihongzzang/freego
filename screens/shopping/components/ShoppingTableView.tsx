import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trash2, Package } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { ShoppingItem as ShoppingListItem } from '@/data/models/shopping.model';
import { Category } from '@/data/enums/category';
import { useMemo } from 'react';
import { ShoppingTableRow } from './ShoppingTableRow';
import Accordion from '@/components/ui/Accordion';
import { useTranslation } from 'react-i18next';

// 날짜를 현재 언어에 맞게 포맷
function formatDateKey(dateString: string | null, unknownDateLabel: string, locale: string): string {
  if (!dateString) return unknownDateLabel;
  const date = new Date(dateString);
  const localeCode = locale === 'ko' ? 'ko-KR' : 'en-US';
  return date.toLocaleDateString(localeCode, { year: 'numeric', month: 'long', day: 'numeric' });
}

// 날짜별로 아이템 그룹화
function groupByPurchasedDate(items: ShoppingListItem[], unknownDateLabel: string, locale: string): Record<string, ShoppingListItem[]> {
  const grouped: Record<string, ShoppingListItem[]> = {};

  items.forEach((item) => {
    const dateKey = formatDateKey(item.purchased_date_time, unknownDateLabel, locale);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(item);
  });

  // 날짜순으로 정렬 (최신순)
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    if (a === unknownDateLabel) return 1;
    if (b === unknownDateLabel) return -1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const sortedGrouped: Record<string, ShoppingListItem[]> = {};
  sortedKeys.forEach((key) => {
    sortedGrouped[key] = grouped[key];
  });

  return sortedGrouped;
}

interface ShoppingTableViewProps {
  items: ShoppingListItem[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onDeleteSelected: () => void;
  onAddSelectedToStorage: () => void;
  onDeleteItem?: (id: string, name: string) => void;
  onMemoPress?: (id: string, currentMemo: string | null) => void;
  onAddToStorage?: (id: string, name: string, category: Category) => void;
  onEmojiPress?: (id: string) => void;
  onNamePress?: (id: string, currentName: string) => void;
  onCancelPurchase?: (id: string, name: string) => void;
  onRepurchase?: (id: string, name: string) => void;
  onDeleteDateItems?: (dateKey: string, itemIds: string[]) => void;
  isPurchasedView?: boolean;
}

export function ShoppingTableView({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onDeleteSelected,
  onAddSelectedToStorage,
  onDeleteItem,
  onMemoPress,
  onAddToStorage,
  onEmojiPress,
  onNamePress,
  onCancelPurchase,
  onRepurchase,
  onDeleteDateItems,
  isPurchasedView = false,
}: ShoppingTableViewProps) {
  const { t, i18n } = useTranslation();
  const { colors, typography, spacing, borderRadius } = useTheme();

  const styles = useMemo(() => createStyles({ spacing, borderRadius }), [spacing, borderRadius]);

  const selectedCount = selectedIds.size;
  const allSelected = items.length > 0 && selectedCount === items.length;

  if (items.length === 0) return null;

  // 구매 완료 탭일 경우 날짜별로 그룹화
  const unknownDateLabel = t('common.unknownDate');
  const groupedItems = isPurchasedView ? groupByPurchasedDate(items, unknownDateLabel, i18n.language) : null;

  return (
    <View style={styles.container}>
      {!isPurchasedView && (
        <View style={styles.sectionHeader}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.clearButton,
                {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  borderWidth: 1,
                },
              ]}
              onPress={onToggleSelectAll}
              activeOpacity={0.7}
            >
              <Text style={[typography.styles.t7Medium, { color: colors.white }]}>
                {allSelected ? t('shopping.actions.deselectAll') : t('shopping.actions.selectAll')}
              </Text>
            </TouchableOpacity>
            {selectedCount > 0 && (
              <TouchableOpacity
                style={[
                  styles.clearButton,
                  {
                    backgroundColor: colors.blue500,
                    borderColor: colors.blue500,
                    borderWidth: 1,
                  },
                ]}
                onPress={onAddSelectedToStorage}
                activeOpacity={0.7}
              >
                <Package size={14} color={colors.white} />
                <Text style={[typography.styles.t7Medium, { color: colors.white }]}>
                  {t('shopping.actions.addToFridge')} ({selectedCount})
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.clearButton,
                {
                  backgroundColor: colors.red500,
                  borderColor: colors.red500,
                  borderWidth: 1,
                },
              ]}
              onPress={onDeleteSelected}
              activeOpacity={0.7}
            >
              <Trash2 size={14} color={colors.white} />
              <Text style={[typography.styles.t7Medium, { color: colors.white }]}>
                {t('shopping.actions.delete')}{selectedCount > 0 ? ` (${selectedCount})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isPurchasedView && groupedItems ? (
        // 구매 완료 탭: 날짜별 아코디언
        Object.entries(groupedItems).map(([dateKey, dateItems]) => (
          <View key={dateKey} style={styles.dateSection}>
            <Accordion
              title={dateKey}
              badge={
                <Text style={[typography.styles.t7Bold, { color: colors.textSecondary }]}>{dateItems.length}</Text>
              }
              rightAction={
                onDeleteDateItems ? (
                  <TouchableOpacity
                    onPress={() =>
                      onDeleteDateItems(
                        dateKey,
                        dateItems.map((item) => item.id),
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Trash2 size={18} color={colors.red500} />
                  </TouchableOpacity>
                ) : undefined
              }
              defaultExpanded={true}
            >
              <View style={styles.tableWrapper}>
                {/* Header */}
                {/* <View style={styles.headerRow}>
                  <View style={[styles.cell, styles.nameCell]}>
                    <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>이름</Text>
                  </View>
                </View> */}

                {/* Data Rows */}
                {dateItems.map((item) => (
                  <ShoppingTableRow
                    key={item.id}
                    id={String(item.id)}
                    name={item.emoji ? `${item.emoji} ${item.name}` : `${item.name}`}
                    isSelected={selectedIds.has(item.id)}
                    isPurchased={item.is_purchased}
                    memo={item.memo}
                    onToggle={() => onToggleSelect(String(item.id))}
                    onMemoPress={onMemoPress ? () => onMemoPress(String(item.id), item.memo) : undefined}
                    onDelete={onDeleteItem ? () => onDeleteItem(String(item.id), item.name) : undefined}
                    onAddToStorage={
                      onAddToStorage ? () => onAddToStorage(String(item.id), item.name, item.category) : undefined
                    }
                    onEmojiPress={onEmojiPress ? () => onEmojiPress(String(item.id)) : undefined}
                    onCancelPurchase={onCancelPurchase ? () => onCancelPurchase(String(item.id), item.name) : undefined}
                    onRepurchase={onRepurchase ? () => onRepurchase(String(item.id), item.name) : undefined}
                    hideCheckbox={isPurchasedView}
                  />
                ))}
              </View>
            </Accordion>
          </View>
        ))
      ) : (
        // 구매 예정 탭: 일반 리스트
        <View style={styles.tableWrapper}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={[styles.cell, styles.checkboxCell]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>{t('shopping.tableHeader.done')}</Text>
            </View>
            <View style={[styles.cell, styles.nameCell]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>{t('shopping.tableHeader.name')}</Text>
            </View>
            <View style={[styles.cell, styles.memoCell]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>{t('shopping.tableHeader.memo')}</Text>
            </View>
          </View>

          {/* Data Rows */}
          {items.map((item) => (
            <ShoppingTableRow
              key={item.id}
              id={String(item.id)}
              name={item.emoji ? `${item.emoji} ${item.name}` : `${item.name}`}
              isSelected={selectedIds.has(item.id)}
              isPurchased={item.is_purchased}
              memo={item.memo}
              onToggle={() => onToggleSelect(String(item.id))}
              onMemoPress={onMemoPress ? () => onMemoPress(String(item.id), item.memo) : undefined}
              onDelete={onDeleteItem ? () => onDeleteItem(String(item.id), item.name) : undefined}
              onAddToStorage={
                onAddToStorage ? () => onAddToStorage(String(item.id), item.name, item.category) : undefined
              }
              onEmojiPress={onEmojiPress ? () => onEmojiPress(String(item.id)) : undefined}
              onNamePress={onNamePress ? () => onNamePress(String(item.id), item.name) : undefined}
              hideCheckbox={isPurchasedView}
            />
          ))}
        </View>
      )}
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
      paddingTop: spacing.xl,
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: spacing.md,
    },

    actionButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
    },

    clearButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
    },

    dateSection: {
      marginBottom: spacing.lg,
    },

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

    checkboxCell: {
      width: 40,
      alignItems: 'center',
    },

    nameCell: {
      flex: 1,
      minWidth: 100,
    },

    memoCell: {
      width: 40,
      alignItems: 'center',
    },
  });
