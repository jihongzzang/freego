import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/lib/theme';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  style?: ViewStyle;
}

export default function Divider({ orientation = 'horizontal', thickness = 1, color, style }: DividerProps) {
  const { colors } = useTheme();

  const dividerStyle: ViewStyle =
    orientation === 'horizontal'
      ? {
          height: thickness,
          width: '100%',
          backgroundColor: color || colors.border,
        }
      : {
          width: thickness,
          height: '100%',
          backgroundColor: color || colors.border,
        };

  return <View style={[dividerStyle, style]} />;
}
