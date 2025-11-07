import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';
import { EditFormData } from '@/mvi/features/ingredient-detail';
import { type IngredientTemplate } from '@/constants/ingredientTemplates';

interface BasicInfoSectionProps {
  formData: EditFormData;
  selectedEmoji: IngredientTemplate | null;
  onFieldChange: (field: keyof EditFormData, value: string) => void;
  onEmojiPress: () => void;
}

export function BasicInfoSection({ formData, selectedEmoji, onFieldChange, onEmojiPress }: BasicInfoSectionProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.inputHeader}>
        <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>이름</Text>
        <TouchableOpacity
          style={[styles.emojiButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={onEmojiPress}
        >
          {selectedEmoji ? (
            <View style={styles.emojiButtonContent}>
              <Text style={typography.styles.t7}>{selectedEmoji.emoji}</Text>
              <Text style={[typography.styles.t7, { color: colors.textTertiary }]}>+</Text>
            </View>
          ) : (
            <Text style={[typography.styles.t7, { color: colors.textTertiary }]}>이모지 +</Text>
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
        placeholder="식재료 이름"
        placeholderTextColor={colors.textTertiary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  emojiButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  emojiButtonContent: {
    width: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});
