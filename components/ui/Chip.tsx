import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/lib/theme';

export type ChipVariant = 'primary' | 'secondary';
export type Color = 'blue' | 'grey' | 'yellow' | 'red' | 'green' | 'teal';
export type ChipSize = 'small' | 'medium' | 'large' | 'xlarge';

interface ChipProps {
  label: string;
  onPress?: () => void;
  variant?: ChipVariant;
  color?: Color;
  size?: ChipSize;
  isOutline?: Boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
}

export default function Chip({
  label,
  onPress,
  variant = 'primary',
  color = 'green',
  size = 'medium',
  disabled = false,
  isOutline = false,
  leftIcon,
  rightIcon,

  style,
}: ChipProps) {
  const { colors, typography } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    const key = `${variant}-${color}` as const;

    const styles: Record<string, ViewStyle> = {
      // Primary variants - filled background with white text
      'primary-blue': {
        backgroundColor: colors.blue500,
        borderColor: colors.blue500,
        borderWidth: isOutline ? 1 : 0,
      },
      'primary-grey': {
        backgroundColor: colors.grey700,
        borderColor: colors.grey700,
        borderWidth: isOutline ? 1 : 0,
      },
      'primary-yellow': {
        backgroundColor: colors.yellow500,
        borderColor: colors.yellow500,
        borderWidth: isOutline ? 1 : 0,
      },
      'primary-red': {
        backgroundColor: colors.red500,
        borderColor: colors.red500,
        borderWidth: isOutline ? 1 : 0,
      },
      'primary-green': {
        backgroundColor: colors.green600,
        borderColor: colors.green600,
        borderWidth: isOutline ? 1 : 0,
      },
      'primary-teal': {
        backgroundColor: colors.teal600,
        borderColor: colors.teal600,
        borderWidth: isOutline ? 1 : 0,
      },

      // Secondary variants - outlined with colored border and text
      'secondary-blue': {
        backgroundColor: 'rgba(49, 139, 246 ,0.16)',
        borderColor: 'rgba(49, 139, 246 ,0.16)',
        borderWidth: isOutline ? 1 : 0,
      },
      'secondary-grey': {
        backgroundColor: 'rgba(78, 89, 104 ,0.16)',
        borderColor: 'rgba(78, 89, 104 ,0.16)',
        borderWidth: isOutline ? 1 : 0,
      },
      'secondary-yellow': {
        backgroundColor: 'rgba(255, 179, 49, 0.16)',
        borderColor: 'rgba(255, 179, 49, 0.16)',
        borderWidth: isOutline ? 1 : 0,
      },
      'secondary-red': {
        backgroundColor: 'rgba(240, 68, 82, 0.16)',
        borderColor: 'rgba(240, 68, 82, 0.16)',
        borderWidth: isOutline ? 1 : 0,
      },
      'secondary-green': {
        backgroundColor: 'rgba(2, 162, 98, 0.16)',
        borderColor: 'rgba(2, 162, 98, 0.16)',
        borderWidth: isOutline ? 1 : 0,
      },
      'secondary-teal': {
        backgroundColor: 'rgba(16, 149, 149, 0.16)',
        borderColor: 'rgba(16, 149, 149, 0.16)',
        borderWidth: isOutline ? 1 : 0,
      },
    };

    return styles[key] || {};
  };

  const getTextColor = (): string => {
    const key = `${variant}-${color}` as const;

    const textColors: Record<string, string> = {
      // Primary variants use white text
      'primary-blue': colors.white,
      'primary-grey': colors.white,
      'primary-yellow': colors.grey800,
      'primary-red': colors.white,
      'primary-green': colors.white,
      'primary-teal': colors.white,

      // Secondary variants use colored text
      'secondary-blue': colors.blue700,
      'secondary-grey': colors.grey700,
      'secondary-yellow': colors.yellow900,
      'secondary-red': colors.red700,
      'secondary-green': colors.green700,
      'secondary-teal': colors.teal700,
    };

    return textColors[key] || colors.text;
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 3,
          paddingHorizontal: 7,
          borderRadius: 11,
        };
      case 'medium':
        return {
          paddingVertical: 3,
          paddingHorizontal: 7,
          borderRadius: 12,
        };
      case 'large':
        return {
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 13,
        };
      case 'xlarge':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 13,
        };
      default:
        return {};
    }
  };

  const getTextStyle = () => {
    switch (size) {
      case 'small':
        return typography.styles.t12Bold;
      case 'medium':
        return typography.styles.t7Bold;
      case 'large':
        return typography.styles.t11Bold;
      case 'xlarge':
        return typography.styles.t11Bold;
      default:
        return typography.styles.t12Bold;
    }
  };

  const content = (
    <View style={[styles.chip, getVariantStyles(), getSizeStyles(), style]}>
      {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
      <Text style={[getTextStyle(), { color: getTextColor() }]}>{label}</Text>
      {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity disabled={disabled} onPress={onPress} activeOpacity={0.7}>
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
