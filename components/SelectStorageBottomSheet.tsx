import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/lib/theme';
import BottomSheet from './ui/BottomSheet';
import { StorageLocation } from '@/data/enums/storage_location';
import { makeStorageList } from '@/utils/category/makeStorageList';
import { getStorageLocationIcon } from '@/utils/storageLocation/getStorageLocationIcon';
import { useTranslation } from 'react-i18next';

interface SelectStorageBottomSheetProps {
  visible: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onSelect: (storageLocation: StorageLocation) => void;
}

export default function SelectStorageBottomSheet({
  visible,
  title,
  description,
  onClose,
  onSelect,
}: SelectStorageBottomSheetProps) {
  const { i18n } = useTranslation();
  const { colors, typography, spacing, borderRadius, isDark } = useTheme();

  const handleSelect = (storageLocation: StorageLocation) => {
    onSelect(storageLocation);
    onClose();
  };

  const lang = i18n.language === 'ko' ? 'kr' : 'en';
  const storageLocations = makeStorageList({ lang });

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title} maxHeight={260}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {description && (
          <Text style={[typography.styles.t5Semibold, { color: colors.textSecondary, marginBottom: 12 }]}>
            {description}
          </Text>
        )}
        <View style={styles.grid}>
          {storageLocations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.locationCard,
                {
                  backgroundColor: 'rgba(78, 89, 104 ,0.16)',
                  borderColor: 'transparent',
                  borderRadius: borderRadius.md,
                },
              ]}
              onPress={() => handleSelect(location.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer]}>{getStorageLocationIcon(location.id, 28)}</View>
              <Text
                style={[
                  typography.styles.t6Semibold,
                  { color: isDark ? colors.grey500 : colors.grey700, marginTop: spacing.sm },
                ]}
              >
                {location.label}
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
    paddingHorizontal: 20,
    paddingTop: 12,
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
