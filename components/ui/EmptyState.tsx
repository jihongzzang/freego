import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/lib/theme';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction, style }: EmptyStateProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderRadius: borderRadius.xl }, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}

      <Text style={[typography.styles.t5Medium, { color: colors.textSecondary, marginBottom: spacing.xs }]}>
        {title}
      </Text>

      {description && (
        <Text style={[typography.styles.t6, { color: colors.textTertiary, textAlign: 'center' }]}>{description}</Text>
      )}

      {actionLabel && onAction && (
        <View style={{ marginTop: spacing.xl }}>
          <Button onPress={onAction} variant="primary">
            {actionLabel}
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 16,
  },
});
