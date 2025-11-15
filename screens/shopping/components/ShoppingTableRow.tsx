import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { useMemo } from 'react';
import { MenuView } from '@react-native-menu/menu';

interface ShoppingTableRowProps {
  id: string;
  name: string;
  isSelected: boolean;
  isPurchased: boolean;
  memo: string | null;
  onToggle: () => void;
  onMemoPress?: () => void;
  onDelete?: () => void;
  onAddToStorage?: () => void;
  onEmojiPress?: () => void;
  onCancelPurchase?: () => void;
  onRepurchase?: () => void;
  hideCheckbox?: boolean;
}

export function ShoppingTableRow({
  name,
  isSelected,
  isPurchased,
  memo,
  onToggle,
  onMemoPress,
  onDelete,
  onAddToStorage,
  onEmojiPress,
  onCancelPurchase,
  onRepurchase,
  hideCheckbox = false,
}: ShoppingTableRowProps) {
  const { colors, typography, spacing } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View
      style={[
        styles.row,
        {
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
      ]}
    >
      {/* Checkbox Cell */}
      {!hideCheckbox && (
        <TouchableOpacity
          style={[styles.cell, styles.checkboxCell, { borderRightWidth: 1, borderRightColor: colors.border }]}
          onPress={onToggle}
          activeOpacity={0.7}
        >
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
        </TouchableOpacity>
      )}

      {/* Name + Memo Cell - With MenuView */}
      <MenuView
          style={{ flex: 1 }}
          onPressAction={({ nativeEvent }) => {
            switch (nativeEvent.event) {
              case 'toggle':
                onToggle?.();
                break;
              case 'add-to-storage':
                onAddToStorage?.();
                break;
              case 'emoji':
                onEmojiPress?.();
                break;
              case 'memo':
                onMemoPress?.();
                break;
              case 'cancel-purchase':
                onCancelPurchase?.();
                break;
              case 'repurchase':
                onRepurchase?.();
                break;
              case 'delete':
                onDelete?.();
                break;
            }
          }}
          actions={
            isPurchased
              ? [
                  {
                    id: 'cancel-purchase',
                    title: '구매완료 취소',
                    image: Platform.select({
                      ios: 'arrow.uturn.backward',
                      android: undefined,
                    }),
                    imageColor: colors.orange600,
                  },
                  {
                    id: 'repurchase',
                    title: '재구매',
                    image: Platform.select({
                      ios: 'arrow.clockwise',
                      android: undefined,
                    }),
                    imageColor: colors.blue600,
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
                ]
              : [
                  {
                    id: 'add-to-storage',
                    title: '냉장고에 넣기',
                    image: Platform.select({
                      ios: 'refrigerator',
                      android: undefined,
                    }),
                    imageColor: colors.blue600,
                  },
                  {
                    id: 'emoji',
                    title: '이모지 수정하기',
                    image: Platform.select({
                      ios: 'face.smiling',
                      android: undefined,
                    }),
                    imageColor: colors.orange600,
                  },
                  {
                    id: 'memo',
                    title: '메모 수정하기',
                    image: Platform.select({
                      ios: 'text.bubble',
                      android: undefined,
                    }),
                    imageColor: colors.primary,
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
                ]
          }
        >
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
        </MenuView>
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
    checkboxCell: {
      width: 40,
      alignItems: 'center',
    },
    nameCell: {
      flex: 1,
      minWidth: 100,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
