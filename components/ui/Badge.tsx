import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/lib/theme';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  style?: ViewStyle;
}

export default function Badge({ children, variant = 'primary', size = 'medium', dot = false, style }: BadgeProps) {
  const { colors, typography, borderRadius, spacing } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: colors.textTertiary,
        };
      case 'success':
        return {
          backgroundColor: colors.success,
        };
      case 'warning':
        return {
          backgroundColor: colors.warning,
        };
      case 'danger':
        return {
          backgroundColor: colors.danger,
        };
      case 'info':
        return {
          backgroundColor: colors.textTertiary,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): ViewStyle => {
    if (dot) {
      switch (size) {
        case 'small':
          return {
            width: 6,
            height: 6,
          };
        case 'medium':
          return {
            width: 8,
            height: 8,
          };
        case 'large':
          return {
            width: 10,
            height: 10,
          };
      }
    }

    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 7,
          paddingVertical: 3,
        };
      case 'medium':
        return {
          paddingHorizontal: 7,
          paddingVertical: 3,
        };
      case 'large':
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
        };
      default:
        return {};
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return typography.styles.t7Bold;
      case 'medium':
        return typography.styles.t6Bold;
      case 'large':
        return typography.styles.t6Bold;
      default:
        return typography.styles.t7Bold;
    }
  };

  if (dot) {
    return <View style={[styles.dot, getVariantStyles(), getSizeStyles(), style]} />;
  }

  return (
    <View style={[styles.badge, getVariantStyles(), getSizeStyles(), { borderRadius: borderRadius.full }, style]}>
      <Text style={[getTextSize(), { color: colors.surface }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    borderRadius: 999,
  },
});
