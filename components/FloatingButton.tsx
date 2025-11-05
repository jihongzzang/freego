import { TouchableOpacity, StyleSheet, Platform, Text } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme';
import { ReactNode } from 'react';

interface FloatingButtonProps {
  onPress: () => void;
  icon?: ReactNode;
  label?: string;
  backgroundColor?: string;
  hasTabBar?: boolean; // 탭바 존재 여부
}

export default function FloatingButton({
  onPress,
  icon,
  label,
  backgroundColor,
  hasTabBar = true
}: FloatingButtonProps) {
  const { colors, borderRadius, typography } = useTheme();
  const insets = useSafeAreaInsets();

  // 탭바 높이를 고려한 bottom 위치 계산
  const bottomPosition = hasTabBar
    ? (insets.bottom > 0 ? 48 + insets.bottom : 48) + 16
    : insets.bottom + 20;

  return (
    <TouchableOpacity
      style={[
        styles.floatingButton,
        label && styles.floatingButtonWithLabel,
        {
          backgroundColor: backgroundColor || colors.primary,
          borderRadius: borderRadius.full,
          bottom: bottomPosition,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
          }),
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon || <Plus size={28} color="#FFFFFF" />}
      {label && (
        <Text style={[typography.styles.button, { color: '#FFFFFF', marginLeft: 8 }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  floatingButtonWithLabel: {
    width: 'auto',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
});
