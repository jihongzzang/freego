import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/lib/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}: ButtonProps) {
  const { colors, typography, borderRadius, spacing } = useTheme();

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
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          backgroundColor: colors.danger,
        };
      default:
        return {};
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return colors.white;
      case 'secondary':
      case 'outline':
      case 'ghost':
        return colors.text;
      default:
        return colors.text;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'xsmall':
        return {
          height: 24,
          paddingHorizontal: spacing.sm,
          borderRadius: borderRadius.sm,
        };
      case 'small':
        return {
          height: 32,
          paddingHorizontal: spacing.md,
          borderRadius: borderRadius.md,
        };
      case 'medium':
        return {
          height: 40,
          paddingHorizontal: spacing.lg,
          borderRadius: borderRadius.lg,
        };
      case 'large':
        return {
          height: 56,
          paddingHorizontal: spacing.xl,
          borderRadius: borderRadius.xl,
        };
      default:
        return {};
    }
  };

  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'xsmall':
        return typography.styles.t7Semibold;
      case 'small':
        return typography.styles.t6Semibold;
      case 'medium':
        return typography.styles.t5Semibold;
      case 'large':
        return typography.styles.st8Semibold;
      default:
        return typography.styles.t5Semibold;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            style={[
              styles.text,
              getTextSize(),
              { color: getTextColor() },
              leftIcon || rightIcon ? styles.textWithIcon : undefined,
              textStyle,
            ]}
          >
            {children}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  textWithIcon: {
    marginHorizontal: 4,
  },
});
