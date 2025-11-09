import { View, StyleSheet } from 'react-native';
import Button from '@/components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme';
import { useMemo } from 'react';

interface SubmitButtonProps {
  onSubmit: () => void;
  disabled?: boolean;
}

export function SubmitButton({ onSubmit, disabled }: SubmitButtonProps) {
  const { spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <Button variant="primary" size="large" onPress={onSubmit} disabled={disabled}>
        등록하기
      </Button>
    </View>
  );
}

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    container: {
      padding: spacing.lg,
    },
  });
