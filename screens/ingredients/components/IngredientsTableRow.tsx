import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { Ingredient } from '@/mvi/features/ingredients';
import { getStorageLocationLabel } from '@/utils/storageLocation';
import { calculateDday, getDdayColor } from '@/utils/date/calculateDday';
import { useMemo } from 'react';
import { MenuView } from '@react-native-menu/menu';

interface IngredientsTableRowProps {
  item: Ingredient;
  onPress: () => void;
  onEdit?: () => void;
  onQuickAdd?: () => void;
  onQuickDelete?: () => void;
  onQuickUpdateExpiry?: () => void;
  onQuickUpdateQuantity?: () => void;
  onQuickUpdateStorage?: () => void;
  onQuickUpdateMemo?: () => void;
  onViewDetail?: () => void;
  isLast?: boolean;
}

export function IngredientsTableRow({
  item,
  onPress,
  onEdit,
  onQuickAdd,
  onQuickDelete,
  onQuickUpdateExpiry,
  onQuickUpdateQuantity,
  onQuickUpdateStorage,
  onQuickUpdateMemo,
  onViewDetail,
  isLast,
}: IngredientsTableRowProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  // 디버깅: item 데이터 출력
  console.log('IngredientsTableRow - item:', {
    id: item.id,
    name: item.name,
    emoji: item.emoji,
    quantity: item.quantity,
    storage: item.storage_location,
  });

  const dday = calculateDday(item.expired_date_time);
  const ddayColorType = getDdayColor(dday);
  const ddayColor =
    ddayColorType === 'danger' ? colors.red500 : ddayColorType === 'warning' ? colors.orange500 : colors.green500;

  const storageLabel = item.storage_location
    ? getStorageLocationLabel({ storageLocation: item.storage_location, lang: 'kr' })
    : '-';

  const quantityLabel = item.quantity ? item.quantity : '-';

  const styles = useMemo(
    () => createStyles({ spacing, borderRadius, isLast: isLast || false }),
    [spacing, borderRadius, isLast],
  );

  return (
    <View
      style={[
        styles.row,
        {
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* Emoji Cell */}
      <View style={[styles.cell, styles.emojiCell, { borderRightWidth: 1, borderRightColor: colors.border }]}>
        <Text style={[typography.styles.t8Medium]}>{item.emoji || '-'}</Text>
      </View>

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
            case 'delete':
              onQuickDelete?.();
              break;
          }
        }}
        actions={[
          {
            id: 'add-to-shopping',
            title: '장보기 항목에 추가',
            image: 'cart',
          },
          {
            id: 'edit',
            title: '수정하기',
            image: 'pencil',
          },
          {
            id: 'view-detail',
            title: '상세로 이동',
            image: 'eye',
          },
          {
            id: 'delete',
            title: '재료 삭제',
            image: 'trash',
            attributes: {
              destructive: true,
            },
          },
        ]}
      >
        <View style={[styles.cell, styles.nameCell, { borderRightWidth: 1, borderRightColor: colors.border }]}>
          <Text
            style={[
              typography.styles.t7,
              {
                color: colors.text,
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
          {storageLabel}
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
