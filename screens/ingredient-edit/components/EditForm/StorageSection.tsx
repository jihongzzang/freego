import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';
import { EditFormData } from '@/mvi/features/ingredient-edit';
import { getStorageLocationIcon } from '@/utils/storageLocation';
import { makeStorageList } from '@/utils/category/makeStorageList';
import { StorageLocation } from '@/data/enums/storage_location';
import { Chip } from '@/components/ui';

interface StorageSectionProps {
  storageLocation: StorageLocation | null;
  onFieldChange: (field: keyof EditFormData, value: StorageLocation) => void;
}

export function StorageSection({ storageLocation, onFieldChange }: StorageSectionProps) {
  const { colors, typography, isDark, borderRadius } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>보관 위치</Text>
      <View style={styles.categoryButtons}>
        {makeStorageList({}).map((loc) => (
          <Chip
            key={loc.id}
            label={loc.label}
            onPress={() => onFieldChange('storage_location', loc.id)}
            variant={storageLocation === loc.id ? 'primary' : 'secondary'}
            color={storageLocation === loc.id ? 'blue' : 'grey'}
            size="xlarge"
            leftIcon={getStorageLocationIcon(loc.id, 18)}
          />
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
