import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trash2, Edit3, Calendar } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { Ingredient } from '@/mvi/features/home';
import { StatusType } from '@/data/enums/status';
import Badge from '@/components/ui/Badge';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useMemo } from 'react';

interface SwipeableIngredientListItemProps {
  item: Ingredient;
  onPress: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onCalendarPress: () => void;
  getExpiryDisplay: (status: StatusType, daysRemaining: number | null) => string;
}

const SWIPE_THRESHOLD = -80;
const BUTTON_WIDTH = 80;

export function SwipeableIngredientListItem({
  item,
  onPress,
  onDelete,
  onEdit,
  onCalendarPress,
  getExpiryDisplay,
}: SwipeableIngredientListItemProps) {
  const { colors, typography, spacing } = useTheme();
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      // 오른쪽으로는 스와이프 못하게, 왼쪽으로만 가능
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, SWIPE_THRESHOLD * 2);
      }
    })
    .onEnd((event) => {
      if (event.translationX < SWIPE_THRESHOLD) {
        // 메뉴 열기
        translateX.value = withSpring(SWIPE_THRESHOLD * 2);
      } else {
        // 메뉴 닫기
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleDelete = () => {
    translateX.value = withSpring(0);
    if (onDelete) {
      runOnJS(onDelete)();
    }
  };

  const handleEdit = () => {
    translateX.value = withSpring(0);
    if (onEdit) {
      runOnJS(onEdit)();
    }
  };

  const handleCalendarPress = () => {
    translateX.value = withSpring(0);
    onCalendarPress();
  };

  const styles = useMemo(() => createStyles(colors, spacing), [colors, spacing]);

  const expiryText = getExpiryDisplay(item.status, item.daysRemaining);
  const isExpired = item.status === 'expired';
  const isExpiring = item.status === 'expiring_soon';

  return (
    <View style={styles.container}>
      {/* 배경 메뉴 버튼들 */}
      <View style={styles.actionsContainer}>
        {onEdit && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.blue600 }]}
            onPress={handleCalendarPress}
            activeOpacity={0.7}
          >
            <Calendar size={20} color={colors.white} />
            <Text style={[typography.styles.t8, { color: colors.white, marginTop: 4 }]}>날짜</Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.danger }]}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Trash2 size={20} color={colors.white} />
            <Text style={[typography.styles.t8, { color: colors.white, marginTop: 4 }]}>삭제</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 메인 컨텐츠 */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.content, animatedStyle]}>
          <TouchableOpacity
            style={styles.listItem}
            onPress={onPress}
            activeOpacity={0.7}
          >
            {/* 왼쪽 이모지 */}
            <View style={styles.emojiWrapper}>
              <View style={styles.emojiContainer}>
                <Text style={typography.styles.t3}>{item.emoji || '🍽️'}</Text>
              </View>
              {isExpired && (
                <Badge
                  variant="danger"
                  dot
                  size="small"
                  style={styles.statusBadge}
                />
              )}
            </View>

            {/* 중앙 정보 */}
            <View style={styles.infoContainer}>
              <View style={styles.nameRow}>
                <Text
                  style={[typography.styles.t6Medium, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                {item.quantity && (
                  <Text
                    style={[typography.styles.t7, { color: colors.textTertiary, marginLeft: 6 }]}
                  >
                    {item.quantity}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  typography.styles.t7,
                  {
                    color: isExpired ? colors.danger : colors.textSecondary,
                    marginTop: 2,
                  },
                ]}
                numberOfLines={1}
              >
                {expiryText}
              </Text>
            </View>

            {/* 오른쪽 정보 */}
            <View style={styles.rightContainer}>
              {item.storage && (
                <Text
                  style={[typography.styles.t8, { color: colors.textTertiary }]}
                  numberOfLines={1}
                >
                  {item.storage}
                </Text>
              )}
              {(isExpiring || isExpired) && (
                <View style={[styles.indicator, { backgroundColor: isExpired ? colors.danger : colors.warning }]} />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const createStyles = (colors: any, spacing: any) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      backgroundColor: colors.surface,
    },
    actionsContainer: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      width: BUTTON_WIDTH,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      backgroundColor: colors.surface,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      minHeight: 72,
    },
    emojiWrapper: {
      position: 'relative',
      marginRight: spacing.md,
    },
    emojiContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'center',
      marginRight: spacing.sm,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rightContainer: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      minWidth: 40,
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginTop: 4,
    },
  });
