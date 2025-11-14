import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { Ingredient } from '@/mvi/features/ingredients';
import { getStorageLocationIcon, getStorageLocationLabel } from '@/utils/storageLocation';
import { calculateDday, getDdayColor } from '@/utils/date/calculateDday';
import { useMemo } from 'react';
import { MenuView } from '@react-native-menu/menu';

interface IngredientsTableRowProps {
  item: Ingredient;
  onEdit?: () => void;
  onQuickAdd?: () => void;
  onQuickConsume?: () => void;
  onQuickDelete?: () => void;
  onQuickUpdateEmoji?: () => void;
  onQuickUpdateExpiry?: () => void;
  onQuickUpdateQuantity?: () => void;
  onQuickUpdateStorage?: () => void;
  onQuickUpdateMemo?: () => void;
  onViewDetail?: () => void;
}

export function IngredientsTableRow({
  item,
  onEdit,
  onQuickAdd,
  onQuickConsume,
  onQuickDelete,
  onQuickUpdateEmoji,
  onQuickUpdateExpiry,
  onQuickUpdateQuantity,
  onQuickUpdateStorage,
  onQuickUpdateMemo,
  onViewDetail,
}: IngredientsTableRowProps) {
  const { isDark, colors, typography, spacing } = useTheme();

  const dday = calculateDday(item.expired_date_time);
  const ddayColorType = getDdayColor(dday);
  const ddayColor =
    ddayColorType === 'danger'
      ? colors.red500
      : ddayColorType === 'warning'
        ? colors.orange500
        : ddayColorType === 'none'
          ? colors.textSecondary
          : colors.green500;

  const quantityLabel = item.quantity ? item.quantity : '-';

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: isDark ? colors.grey900 : colors.surface,
          borderColor: colors.border,
          borderRadius: spacing.sm,
          borderWidth: 1,
        },
      ]}
    >
      {/* Emoji Cell */}
      <TouchableOpacity
        style={[styles.cell, styles.emojiCell, { borderRightWidth: 1, borderRightColor: colors.border }]}
        onPress={(e) => {
          e.stopPropagation();
          onQuickUpdateEmoji?.();
        }}
        activeOpacity={0.7}
      >
        <Text style={[typography.styles.t8Medium, { textAlign: 'center' }]}>{item.emoji || '-'}</Text>
      </TouchableOpacity>

      {/* Name Cell - With MenuView */}
      <MenuView
        style={{ flex: 1 }}
        onPressAction={({ nativeEvent }) => {
          switch (nativeEvent.event) {
            case 'add-to-shopping':
              onQuickAdd?.();
              break;
            case 'edit':
              onEdit?.();
              break;
            case 'view-detail':
              onViewDetail?.();
              break;
            case 'consume':
              onQuickConsume?.();
              break;
            case 'delete':
              onQuickDelete?.();
              break;
          }
        }}
        actions={[
          {
            id: 'add-to-shopping',
            title: '장보기 항목에 추가하기',
            image: Platform.select({
              ios: 'cart',
              android: undefined,
            }),
            imageColor: colors.primary,
          },
          {
            id: 'edit',
            title: '수정하기',
            image: Platform.select({
              ios: 'square.and.pencil',
              android: undefined,
            }),
            imageColor: colors.blue600,
          },
          {
            id: 'consume',
            title: '소모하기',
            image: Platform.select({
              ios: 'checkmark.circle',
              android: undefined,
            }),
            imageColor: colors.yellow600,
          },
          {
            id: 'delete',
            title: '삭제하기',
            image: Platform.select({
              ios: 'trash',
              android: undefined,
            }),
            attributes: {
              destructive: true,
            },
            imageColor: colors.red600,
          },
          {
            id: 'view-detail',
            title: '상세가기',
            image: Platform.select({
              ios: 'chevron.right',
              android: undefined,
            }),
            imageColor: colors.grey600,
          },
        ]}
      >
        <View style={[styles.cell, styles.nameCell, { borderRightWidth: 1, borderRightColor: colors.border }]}>
          <Text
            style={[
              typography.styles.t7,
              {
                color: colors.textSecondary,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
        </View>
      </MenuView>

      {/* Quantity Cell - Clickable */}
      <TouchableOpacity
        style={[styles.cell, styles.quantityCell, { borderRightWidth: 1, borderRightColor: colors.border }]}
        onPress={(e) => {
          e.stopPropagation();
          onQuickUpdateQuantity?.();
        }}
        activeOpacity={0.7}
      >
        <Text
          style={[
            typography.styles.t7,
            {
              color: colors.textSecondary,
            },
          ]}
          numberOfLines={1}
        >
          {quantityLabel}
        </Text>
      </TouchableOpacity>

      {/* Storage Cell */}
      <TouchableOpacity
        style={[styles.cell, styles.storageCell, { borderRightWidth: 1, borderRightColor: colors.border }]}
        onPress={(e) => {
          e.stopPropagation();
          onQuickUpdateStorage?.();
        }}
      >
        <Text
          style={[
            typography.styles.t7,
            {
              color: colors.textSecondary,
            },
          ]}
          numberOfLines={1}
        >
          {item.storage_location ? getStorageLocationIcon(item.storage_location, 16) : '-'}
        </Text>
      </TouchableOpacity>

      {/* Expiry Date Cell - Clickable */}
      <TouchableOpacity
        style={[styles.cell, styles.expiryCell, { borderRightWidth: 1, borderRightColor: colors.border }]}
        onPress={(e) => {
          e.stopPropagation();
          onQuickUpdateExpiry?.();
        }}
        activeOpacity={0.7}
      >
        <Text
          style={[
            typography.styles.t7,
            {
              color: ddayColor,
            },
          ]}
          numberOfLines={1}
        >
          {dday}
        </Text>
      </TouchableOpacity>

      {/* Memo Cell */}
      <TouchableOpacity
        style={[styles.cell, styles.memoCell]}
        onPress={(e) => {
          e.stopPropagation();
          onQuickUpdateMemo?.();
        }}
      >
        <MessageSquare
          size={16}
          fill={item.memo ? colors.green500 : colors.surface}
          color={item.memo ? colors.green500 : colors.green500}
        />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      paddingHorizontal: spacing.xs,
      minHeight: 48,
      alignItems: 'stretch',
      borderRadius: spacing.sm,
      borderWidth: 1,
    },

    cell: {
      justifyContent: 'center',
      paddingHorizontal: spacing.sm,
      alignSelf: 'stretch',
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
      alignItems: 'center',
    },

    storageCell: {
      width: 60,
      alignItems: 'center',
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
