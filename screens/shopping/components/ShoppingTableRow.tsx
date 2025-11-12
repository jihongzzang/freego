import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, Trash2, MessageSquare, Refrigerator } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { getCategoryColor } from '@/utils/category/getCategoryColor';
import { getCategoryLabel } from '@/utils/category/getCategoryLabel';
import { Category } from '@/data/enums/category';
import { useMemo } from 'react';
import { getCategoryIcon } from '@/utils/category';

interface ShoppingTableRowProps {
  id: string;
  name: string;
  category: Category;
  isSelected: boolean;
  memo?: string;
  onToggle: () => void;
  onMemoPress?: () => void;
  onDelete?: () => void;
  onAddToStorage?: () => void;
  isLast?: boolean;
}

export function ShoppingTableRow({
  name,
  category,
  isSelected,
  memo,
  onToggle,
  onMemoPress,
  onDelete,
  onAddToStorage,
  isLast,
}: ShoppingTableRowProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const styles = useMemo(
    () => createStyles({ spacing, borderRadius, isLast: isLast || false }),
    [spacing, borderRadius, isLast],
  );

  return (
    <TouchableOpacity
      style={[
        styles.row,
        {
          borderBottomColor: colors.border,
          backgroundColor: colors.surface,
        },
      ]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {/* Checkbox Cell */}
      <View style={[styles.cell, styles.checkboxCell]}>
        <View
          style={[
            styles.checkbox,
            {
              borderColor: isSelected ? colors.primary : colors.border,
              backgroundColor: isSelected ? colors.primary : colors.background,
            },
          ]}
        >
          {isSelected && <Check size={12} color={colors.white} />}
        </View>
      </View>

      {/* Name + Memo Cell */}
      <View style={[styles.cell, styles.nameCell]}>
        <Text
          style={[
            typography.styles.t7Semibold,
            {
              color: colors.text,
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </Text>
        {memo && (
          <Text
            style={[
              typography.styles.t7,
              {
                color: colors.textSecondary,
                fontSize: 11,
                marginTop: 2,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {memo}
          </Text>
        )}
      </View>

      {/* Action Cell */}
      <View style={[styles.cell, styles.actionCell]}>
        <View style={styles.actionButtons}>
          {isSelected ? (
            // 선택된 상태: 냉장고 아이콘만
            onAddToStorage && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onAddToStorage();
                }}
                activeOpacity={0.7}
              >
                <Refrigerator size={18} color={colors.blue500} />
              </TouchableOpacity>
            )
          ) : (
            // 선택되지 않은 상태: 메모 + 삭제 아이콘
            <>
              {onMemoPress && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onMemoPress();
                  }}
                  activeOpacity={0.7}
                >
                  <MessageSquare
                    size={16}
                    fill={memo ? colors.green500 : colors.surface}
                    color={memo ? colors.green500 : colors.green500}
                  />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  activeOpacity={0.7}
                >
                  <Trash2 size={16} color={colors.red500} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = ({
  spacing,
  borderRadius,
  isLast,
}: {
  spacing: typeof import('@/lib/theme').spacing;
  borderRadius: typeof import('@/lib/theme').borderRadius;
  isLast: boolean;
}) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xs,
      borderBottomWidth: isLast ? 0 : 1,
      minHeight: 48,
      alignItems: 'center',
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
    actionCell: {
      width: 80,
      alignItems: 'center',
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    actionButton: {
      padding: 4,
    },
  });
