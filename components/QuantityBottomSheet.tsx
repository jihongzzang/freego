import { View, StyleSheet, TextInput } from 'react-native';
import { useTheme } from '@/lib/theme';
import BottomSheet from '@/components/ui/BottomSheet';
import { Button } from './ui';
import { useTranslation } from 'react-i18next';

interface QuantityBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  quantity: string;
  onQuantityChange: (text: string) => void;
  onConfirm: () => void;
}

export default function QuantityBottomSheet({
  visible,
  onClose,
  title,
  quantity,
  onQuantityChange,
  onConfirm,
}: QuantityBottomSheetProps) {
  const { t } = useTranslation();
  const { colors, typography, isDark, spacing } = useTheme();

  return (
    <BottomSheet maxHeight={280} visible={visible} onClose={onClose} title={title}>
      <View style={styles.container}>
        <View style={styles.content}>
          <TextInput
            style={[
              styles.input,
              typography.styles.t5,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={quantity}
            onChangeText={onQuantityChange}
            placeholder={t('bottomSheet.quantityPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            autoFocus
          />
        </View>

        <View
          style={[
            styles.confirmButtonContainer,
            {
              backgroundColor: isDark ? '#202027' : colors.white,
              paddingVertical: spacing.xl,
              paddingHorizontal: spacing.xl,
            },
          ]}
        >
          <Button size="large" variant="primary" onPress={onConfirm}>
            {t('common.confirm')}
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  content: {
    paddingHorizontal: 20,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    minHeight: 56,
  },
  confirmButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
