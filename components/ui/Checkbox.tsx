import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Checkbox({ checked, onCheckedChange, label, disabled = false, style }: CheckboxProps) {
  const { colors, typography, spacing } = useTheme();

  const handleToggle = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handleToggle}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderColor: checked ? colors.primary : colors.border,
            backgroundColor: checked ? colors.primary : 'transparent',
          },
          disabled && styles.disabled,
        ]}
      >
        {checked && <Check size={16} color={colors.white} />}
      </View>

      {label && (
        <Text
          style={[
            typography.styles.t5,
            {
              color: colors.text,
              marginLeft: spacing.sm,
            },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
