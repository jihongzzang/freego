import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/lib/theme';

export type SpinnerSize = 'small' | 'medium' | 'large';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
  label?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export default function Spinner({ size = 'medium', color, label, fullScreen = false, style }: SpinnerProps) {
  const { colors, typography, spacing } = useTheme();

  const getSize = (): 'small' | 'large' => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      case 'medium':
      default:
        return 'large';
    }
  };

  const content = (
    <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
      <ActivityIndicator size={getSize()} color={color || colors.primary} />
      {label && (
        <Text style={[typography.styles.t5, { color: colors.textSecondary, marginTop: spacing.md }]}>{label}</Text>
      )}
    </View>
  );

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fullScreen: {
    flex: 1,
  },
});
