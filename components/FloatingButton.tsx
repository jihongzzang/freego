import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme';

interface FloatingButtonProps {
  onPress: () => void;
}

export default function FloatingButton({ onPress }: FloatingButtonProps) {
  const { colors, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();

  // 탭바 높이를 고려한 bottom 위치 계산
  const bottomPosition = (insets.bottom > 0 ? 56 + insets.bottom : 56) + 20;

  return (
    <TouchableOpacity
      style={[
        styles.floatingButton,
        {
          backgroundColor: colors.primary,
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
      <Plus size={28} color="#FFFFFF" />
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
});
