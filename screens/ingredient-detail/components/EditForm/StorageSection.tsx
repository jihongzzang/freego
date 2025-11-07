import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';
import { STORAGE_LOCATIONS } from '@/constants/storageLocations';
import { EditFormData } from '@/mvi/features/ingredient-detail';
import { getStorageLocationIcon } from '@/utils/getStorageLocationIcons';

interface StorageSectionProps {
  storageLocation: string;
  onFieldChange: (field: keyof EditFormData, value: string) => void;
}

export function StorageSection({ storageLocation, onFieldChange }: StorageSectionProps) {
  const { colors, typography, isDark, borderRadius } = useTheme();

  return (
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
  storageBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
