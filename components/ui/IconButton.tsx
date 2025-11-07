import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/lib/theme';

export type IconButtonVariant = 'default' | 'primary' | 'secondary' | 'danger' | 'ghost';
export type IconButtonSize = 'small' | 'medium' | 'large';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function IconButton({
  icon,
  onPress,
  variant = 'default',
  size = 'medium',
  disabled = false,
  style,
}: IconButtonProps) {
  const { colors, borderRadius } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: colors.surfaceSecondary,
        };
      case 'danger':
        return {
          backgroundColor: colors.dangerLight,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'default':
      default:
        return {
          backgroundColor: colors.surfaceSecondary,
        };
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          width: 32,
          height: 32,
          borderRadius: borderRadius.md,
        };
      case 'medium':
        return {
          width: 40,
          height: 40,
          borderRadius: borderRadius.lg,
        };
      case 'large':
        return {
          width: 48,
          height: 48,
          borderRadius: borderRadius.xl,
        };
      default:
        return {};
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getVariantStyles(), getSizeStyles(), disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
