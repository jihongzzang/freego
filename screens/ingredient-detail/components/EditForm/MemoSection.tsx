import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';
import { STORAGE_LOCATIONS } from '@/constants/storageLocations';
import { EditFormData } from '@/mvi/features/ingredient-detail';
import { getStorageLocationIcon } from '@/utils/getStorageLocationIcons';

interface MemoSectionProps {
  memo: string;
  onFieldChange: (field: keyof EditFormData, value: string) => void;
}

export function MemoSection({ memo, onFieldChange }: MemoSectionProps) {
  const { colors, typography, isDark, borderRadius } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>메모</Text>
      <TextInput
        style={[
          styles.input,
          styles.textArea,
          typography.styles.t6,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
          },
        ]}
        value={memo}
        onChangeText={(text) => onFieldChange('memo', text)}
        placeholder="메모를 입력하세요"
        placeholderTextColor={colors.textTertiary}
        multiline
        numberOfLines={4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});
