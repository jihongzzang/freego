import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/lib/theme';
import BottomSheet from './BottomSheet';
import { STORAGE_LOCATIONS, StorageLocationType } from '@/constants/storageLocations';
import { getStorageLocationIcon } from '@/utils/getStorageLocationIcons';

interface SelectStorageBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (storageLocation: StorageLocationType) => void;
}

export default function SelectStorageBottomSheet({ visible, onClose, onSelect }: SelectStorageBottomSheetProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const handleSelect = (storageLocation: StorageLocationType) => {
    onSelect(storageLocation);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="보관위치 선택" maxHeight={250}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {STORAGE_LOCATIONS.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.locationCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.lg,
                },
              ]}
              onPress={() => handleSelect(location.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer]}>{getStorageLocationIcon(location.id, 28)}</View>
              <Text style={[typography.styles.t6Semibold, { color: colors.text, marginTop: spacing.sm }]}>
                {location.krLabel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 250,
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between', // ✅ 가로 간격 균등
  },
  locationCard: {
    width: '31%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    padding: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
