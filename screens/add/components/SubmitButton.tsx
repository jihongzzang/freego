import { View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SubmitButtonProps {
  onSubmit: () => void;
  disabled?: boolean;
}

export function SubmitButton({ onSubmit, disabled }: SubmitButtonProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <Button
        variant="primary"
        size="large"
        onPress={onSubmit}
        disabled={disabled}
        leftIcon={<Check size={20} color="#ffffff" />}
      >
        등록하기
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
