import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trash2, Package } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { ShoppingItem as ShoppingListItem } from '@/data/models/shopping.model';
import { Category } from '@/data/enums/category';
import { useMemo } from 'react';
import { ShoppingTableRow } from './ShoppingTableRow';
import { getDefaultEmoji } from '@/utils/category';

interface ShoppingTableViewProps {
  items: ShoppingListItem[];
  selectedIds: Set<number>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onDeleteSelected: () => void;
  onAddSelectedToStorage: () => void;
  onDeleteItem?: (id: string, name: string) => void;
  onMemoPress?: (id: string, currentMemo?: string) => void;
  onAddToStorage?: (id: string, name: string, category: Category) => void;
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
}: ShoppingTableViewProps) {
  const { colors, typography, spacing, borderRadius, isDark } = useTheme();

  const styles = useMemo(() => createStyles({ spacing, borderRadius }), [spacing, borderRadius]);

  const selectedCount = selectedIds.size;
  const allSelected = items.length > 0 && selectedCount === items.length;

  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
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
              <Text style={[typography.styles.t7Medium, { color: colors.white }]}>냉장고에 넣기 ({selectedCount})</Text>
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
            <View style={[styles.cell, styles.checkboxCell]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>완료</Text>
            </View>
            <View style={[styles.cell, styles.nameCell]}>
              <Text style={[typography.styles.t8Medium, { color: colors.textSecondary }]}>이름</Text>
            </View>
          </View>

          {/* Data Rows */}
          {items.map((item, index) => (
            <ShoppingTableRow
              key={item.id}
              id={String(item.id)}
              name={item.emoji ? `${item.name} ${item.emoji}` : `${item.name} ${getDefaultEmoji(item.category)}`}
              category={item.category}
              isSelected={selectedIds.has(item.id)}
              memo={item.memo}
              onToggle={() => onToggleSelect(String(item.id))}
              onMemoPress={onMemoPress ? () => onMemoPress(String(item.id), item.memo) : undefined}
              onDelete={onDeleteItem ? () => onDeleteItem(String(item.id), item.name) : undefined}
              onAddToStorage={
                onAddToStorage ? () => onAddToStorage(String(item.id), item.name, item.category) : undefined
              }
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
    checkboxCell: {
      width: 40,
      alignItems: 'center',
    },
    nameCell: {
      flex: 1,
      minWidth: 100,
    },
  });
