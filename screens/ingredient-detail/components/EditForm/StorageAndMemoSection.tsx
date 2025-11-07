import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';
import { STORAGE_LOCATIONS } from '@/constants/storageLocations';
import { EditFormData } from '@/mvi/features/ingredient-detail';
import { getStorageLocationIcon } from '@/utils/getStorageLocationIcons';

interface StorageAndMemoSectionProps {
  storageLocation: string;
  memo: string;
  onFieldChange: (field: keyof EditFormData, value: string) => void;
}

export function StorageAndMemoSection({ storageLocation, memo, onFieldChange }: StorageAndMemoSectionProps) {
  const { colors, typography, isDark, borderRadius } = useTheme();

  return (
    <>
      {/* 보관 위치 */}
      <View style={styles.container}>
        <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>보관 위치</Text>
        <View style={styles.categoryButtons}>
          {STORAGE_LOCATIONS.map((loc) => (
            <TouchableOpacity
              key={loc.id}
              style={[
                styles.categoryBtn,
                {
                  backgroundColor: isDark ? colors.grey400 : colors.grey200,
                  borderColor: isDark ? colors.grey400 : colors.grey200,
                  borderRadius: borderRadius.lg,
                },
                storageLocation === loc.id && {
                  backgroundColor: isDark ? colors.grey600 : colors.grey400,
                  borderColor: isDark ? colors.grey600 : colors.grey400,
                },
              ]}
              onPress={() => onFieldChange('storage_location', loc.id)}
            >
              <View style={styles.storageBtnContent}>
                {getStorageLocationIcon(loc.id, 18)}
                <Text
                  style={[
                    typography.styles.t6,
                    { color: colors.grey700 },
                    storageLocation === loc.id && {
                      color: isDark ? colors.text : colors.white,
                    },
                  ]}
                >
                  {loc.krLabel}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 메모 */}
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
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
  storageBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
