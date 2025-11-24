import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';
import { EditFormData } from '@/mvi/features/ingredient-edit';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface BasicInfoSectionProps {
  formData: EditFormData;
  selectedEmoji: string | null;
  onFieldChange: (field: keyof EditFormData, value: string) => void;
  onEmojiPress: () => void;
}

export function BasicInfoSection({ formData, selectedEmoji, onFieldChange, onEmojiPress }: BasicInfoSectionProps) {
  const { t } = useTranslation();
  const { colors, typography, spacing, borderRadius } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={styles.container}>
      <View style={styles.inputHeader}>
        <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>{t('ingredientForm.name')}</Text>
        <TouchableOpacity
          style={[styles.emojiButton, { backgroundColor: colors.surface, borderColor: colors.surface }]}
          onPress={onEmojiPress}
        >
          {selectedEmoji ? (
            <View style={styles.emojiButtonContent}>
              <Text style={typography.styles.t7}>{selectedEmoji}</Text>
              <Text style={[typography.styles.t7, { color: colors.textTertiary }]}>+</Text>
            </View>
          ) : (
            <Text style={[typography.styles.t7, { color: colors.textTertiary }]}>{t('ingredientForm.emojiAdd')}</Text>
          )}
        </TouchableOpacity>
      </View>
      <TextInput
        style={[
          styles.input,
          typography.styles.t6,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
          },
        ]}
        value={formData.name}
        onChangeText={(text) => onFieldChange('name', text)}
        placeholder={t('ingredientForm.namePlaceholder')}
        placeholderTextColor={colors.textTertiary}
      />
    </View>
  );
}

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    container: {
      gap: spacing.sm,
    },
    inputHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    input: {
      paddingHorizontal: spacing.lg,
      paddingVertical: 14,
      borderWidth: 1,
    },
    emojiButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 6,
      borderWidth: 1,
    },
    emojiButtonContent: {
      width: 40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
  });
