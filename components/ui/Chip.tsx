import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { ColorPalette, useTheme } from '@/lib/theme';

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
  badgeWidth?: number;
  outlineType?: boolean; // true일 때 selected 상태에서 outline만 변경
  style?: ViewStyle;
  selectedColor?: string;
  borderColor?: string;
  backgroundColor?: string;
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
  badgeWidth,
  outlineType = false,
  style,
  selectedColor,
  borderColor,
  backgroundColor,
}: ChipProps) {
  const { colors, typography, borderRadius, spacing } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    // outlineType이 true일 때: selected 상태에서 outline만 변경
    if (outlineType && selected) {
      return {
        backgroundColor: colors.surface,
        borderColor: colors.primary,
        borderWidth: 2,
      };
    }

    // 기본 동작: selected 상태에서 배경색 변경
    if (selected) {
      return {
        backgroundColor: selectedColor || colors.primary,
        borderColor: selectedColor || colors.primary,
        borderWidth: 1,
      };
    }

    switch (variant) {
      case 'filled':
        return {
          backgroundColor: backgroundColor || colors.surfaceSecondary,
          borderColor: backgroundColor || colors.surfaceSecondary,
          borderWidth: 1,
        };

      case 'outlined':
        return {
          backgroundColor: backgroundColor || colors.surface,
          borderColor: borderColor || colors.border,
          borderWidth: 1,
        };

      case 'selected':
        return {
          backgroundColor: backgroundColor || colors.primaryLight,
          borderColor: borderColor || colors.primary,
          borderWidth: 1,
        };

      default:
        return {};
    }
  };

  const getTextColor = (): string => {
    // outlineType일 때는 selected 상태에서도 primary 색상 사용
    if (outlineType && selected) {
      return colors.text;
    }

    // 기본 동작
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

  const getBadgeStyles = () => {
    if (outlineType && selected) {
      return {
        backgroundColor: colors.surfaceSecondary,
        textColor: colors.textSecondary,
      };
    }

    if (selected) {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        textColor: colors.white,
      };
    }

    return {
      backgroundColor: colors.surfaceSecondary,
      textColor: colors.textSecondary,
    };
  };

  const badgeStyles = getBadgeStyles();

  const content = (
    <View style={[styles.chip, getVariantStyles(), getSizeStyles(), disabled && styles.disabled, style]}>
      {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
      <Text style={[typography.styles.t6Medium, { color: getTextColor() }]}>{label}</Text>

      {badge !== undefined && badge > 0 && (
        <View
          style={[
            styles.badge,
            { backgroundColor: badgeStyles.backgroundColor },
            badgeWidth ? { minWidth: badgeWidth, minHeight: badgeWidth } : {},
          ]}
        >
          <Text style={[typography.styles.t7Bold, { color: badgeStyles.textColor }]}>{badge}</Text>
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
    marginLeft: 4,
    borderRadius: 999,
    minWidth: 20,
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
