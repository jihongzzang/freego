import { View, StyleSheet, TextInput } from 'react-native';
import { useTheme } from '@/lib/theme';
import BottomSheet from '@/components/ui/BottomSheet';
import { Button } from './ui';
import { useTranslation } from 'react-i18next';

interface NameBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  name: string;
  onNameChange: (text: string) => void;
  onConfirm: () => void;
}

export default function NameBottomSheet({
  visible,
  onClose,
  title,
  name,
  onNameChange,
  onConfirm,
}: NameBottomSheetProps) {
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
            value={name}
            onChangeText={onNameChange}
            placeholder={t('bottomSheet.namePlaceholder')}
            placeholderTextColor={colors.textTertiary}
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
          <Button size="large" variant="primary" onPress={onConfirm} disabled={!name}>
            {t('common.save')}
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
    minHeight: 50,
  },
  confirmButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
