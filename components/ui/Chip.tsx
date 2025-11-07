import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/lib/theme';

export type ChipVariant = 'filled' | 'outlined' | 'selected';
export type ChipSize = 'small' | 'medium' | 'large';

interface ChipProps {
  label: string;
  onPress?: () => void;
  variant?: ChipVariant;
  size?: ChipSize;
  selected?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  badge?: number;
  style?: ViewStyle;
}

export default function Chip({
  label,
  onPress,
  variant = 'filled',
  size = 'medium',
  selected = false,
  disabled = false,
  leftIcon,
  rightIcon,
  badge,
  style,
}: ChipProps) {
  const { colors, typography, borderRadius, spacing } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    if (selected) {
      return {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        borderWidth: 1,
      };
    }

    switch (variant) {
      case 'filled':
        return {
          backgroundColor: colors.surfaceSecondary,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'selected':
        return {
          backgroundColor: colors.primaryLight,
          borderWidth: 1,
          borderColor: colors.primary,
        };
      default:
        return {};
    }
  };

  const getTextColor = (): string => {
    if (selected) {
      return colors.white;
    }
    return colors.text;
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
          borderRadius: borderRadius.sm,
        };
      case 'medium':
        return {
          paddingVertical: spacing.xs + 2,
          paddingHorizontal: spacing.md,
          borderRadius: borderRadius.md,
        };
      case 'large':
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderRadius: borderRadius.lg,
        };
      default:
        return {};
    }
  };

  const content = (
    <View style={[styles.chip, getVariantStyles(), getSizeStyles(), disabled && styles.disabled, style]}>
      {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
      <Text style={[typography.styles.t6Medium, { color: getTextColor() }]}>{label}</Text>
      {badge !== undefined && badge > 0 && (
        <View style={[styles.badge, { backgroundColor: selected ? 'rgba(255, 255, 255, 0.3)' : colors.surfaceSecondary }]}>
          <Text style={[typography.styles.t7Bold, { color: selected ? colors.white : colors.textSecondary }]}>
            {badge}
          </Text>
        </View>
      )}
      {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    marginHorizontal: 4,
  },
  badge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
