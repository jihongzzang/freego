import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ViewStyle } from 'react-native';
import { useTheme } from '@/lib/theme';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  style?: ViewStyle;
}

export default function Switch({ value, onValueChange, disabled = false, label, style }: SwitchProps) {
  const { colors, typography, spacing } = useTheme();
  const translateX = React.useRef(new Animated.Value(value ? 20 : 0)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 20 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const handleToggle = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[typography.styles.t5, { color: colors.text, marginRight: spacing.md }]}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.track,
          {
            backgroundColor: value ? colors.primary : colors.border,
          },
          disabled && styles.disabled,
        ]}
        onPress={handleToggle}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: colors.white,
              transform: [{ translateX }],
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  disabled: {
    opacity: 0.5,
  },
});
