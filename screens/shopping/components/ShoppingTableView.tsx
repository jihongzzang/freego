import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trash2, Package } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { ShoppingItem as ShoppingListItem } from '@/data/models/shopping.model';
import { Category } from '@/data/enums/category';
import { useMemo } from 'react';
import { ShoppingTableRow } from './ShoppingTableRow';

// 날짜를 "YYYY-MM-DD" 형식으로 변환
function formatDateKey(dateString: string | null): string {
  if (!dateString) return '날짜 미상';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

// 날짜별로 아이템 그룹화
function groupByPurchasedDate(items: ShoppingListItem[]): Record<string, ShoppingListItem[]> {
  const grouped: Record<string, ShoppingListItem[]> = {};

  items.forEach((item) => {
    const dateKey = formatDateKey(item.purchased_date_time);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(item);
  });

  // 날짜순으로 정렬 (최신순)
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    if (a === '날짜 미상') return 1;
    if (b === '날짜 미상') return -1;
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
  isPurchasedView = false,
}: ShoppingTableViewProps) {
  const { colors, typography, spacing, borderRadius, isDark } = useTheme();

  const styles = useMemo(() => createStyles({ spacing, borderRadius }), [spacing, borderRadius]);

  const selectedCount = selectedIds.size;
  const allSelected = items.length > 0 && selectedCount === items.length;

  if (items.length === 0) return null;

  // 구매 완료 탭일 경우 날짜별로 그룹화
  const groupedItems = isPurchasedView ? groupByPurchasedDate(items) : null;

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
                {allSelected ? '전체 해제' : '전체 선택'}
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
                  냉장고에 넣기 ({selectedCount})
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
                삭제{selectedCount > 0 ? ` (${selectedCount})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isPurchasedView && groupedItems ? (
        // 구매 완료 탭: 날짜별 그룹화
        Object.entries(groupedItems).map(([dateKey, dateItems]) => (
          <View key={dateKey} style={styles.dateSection}>
            <View style={styles.dateSectionHeader}>
              <Text style={[typography.styles.t7Bold, { color: colors.text }]}>{dateKey}</Text>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>
                {dateItems.length}개 항목
              </Text>
            </View>
            <View style={styles.tableWrapper}>
              {/* Header */}
              <View
                style={[
                  styles.headerRow,
                  { backgroundColor: isDark ? colors.grey900 : colors.surface, borderColor: colors.border },
                ]}
              >
                <View style={[styles.cell, styles.nameCell]}>
                  <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>이름</Text>
                </View>
              </View>

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
                  hideCheckbox={isPurchasedView}
                />
              ))}
            </View>
          </View>
        ))
      ) : (
        // 구매 예정 탭: 일반 리스트
        <View style={styles.tableWrapper}>
          {/* Header */}
          <View
            style={[
              styles.headerRow,
              { backgroundColor: isDark ? colors.grey900 : colors.surface, borderColor: colors.border },
            ]}
          >
            {!isPurchasedView && (
              <View
                style={[styles.cell, styles.checkboxCell, { borderRightWidth: 1, borderRightColor: colors.border }]}
              >
                <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>완료</Text>
              </View>
            )}
            <View style={[styles.cell, styles.nameCell]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>이름</Text>
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

    dateSectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
      paddingHorizontal: spacing.xs,
    },

    tableWrapper: {
      overflow: 'hidden',
      flexDirection: 'column',
      gap: spacing.sm,
    },

    headerRow: {
      flexDirection: 'row',
      paddingHorizontal: spacing.xs,
      marginBottom: spacing.xs,
      borderRadius: spacing.sm,
      borderWidth: 1,
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
  });
