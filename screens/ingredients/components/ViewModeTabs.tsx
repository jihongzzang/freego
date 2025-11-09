import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';
import { ViewMode } from '../hooks/useIngredientsLogic';
import { useMemo } from 'react';

interface ViewModeTabsProps {
  viewMode: ViewMode;
  onChangeMode: (mode: ViewMode) => void;
}

export function ViewModeTabs({ viewMode, onChangeMode }: ViewModeTabsProps) {
  const { colors, typography, spacing, isDark } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
      <TouchableOpacity
        style={[
          styles.tab,
          {
            borderBottomColor: viewMode === 'category' ? (isDark ? colors.grey600 : colors.grey800) : 'transparent',
          },
        ]}
        onPress={() => onChangeMode('category')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            typography.styles.t5Semibold,
            { color: viewMode === 'category' ? (isDark ? colors.white : colors.grey900) : colors.textTertiary },
          ]}
        >
          카테고리별
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          {
            borderBottomColor: viewMode === 'storage' ? (isDark ? colors.grey600 : colors.grey800) : 'transparent',
          },
        ]}
        onPress={() => onChangeMode('storage')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            typography.styles.t5Semibold,
            { color: viewMode === 'storage' ? (isDark ? colors.white : colors.grey900) : colors.textTertiary },
          ]}
        >
          보관위치별
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      gap: spacing.sm,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderBottomWidth: 2,
    },
  });
