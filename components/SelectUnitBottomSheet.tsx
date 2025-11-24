import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/theme';
import BottomSheet from '@/components/ui/BottomSheet';
import { Unit } from '@/data/enums/unit';
import { makeUnitList } from '@/utils/unit/makeUnitList';
import { useTranslation } from 'react-i18next';

interface SelectUnitBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedUnit?: Unit;
  onUnitSelect: (unitId: Unit) => void;
}

export default function SelectUnitBottomSheet({
  visible,
  onClose,
  selectedUnit,
  onUnitSelect,
}: SelectUnitBottomSheetProps) {
  const { t, i18n } = useTranslation();
  const { colors, typography, spacing, borderRadius, isDark } = useTheme();

  const handleUnitSelect = (unitId: Unit) => {
    onUnitSelect(unitId);
    onClose();
  };

  const lang = i18n.language === 'ko' ? 'kr' : 'en';
  const units = makeUnitList({ lang });

  return (
    <BottomSheet maxHeight={450} visible={visible} onClose={onClose} title={t('bottomSheet.selectUnit')}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {units.map((unit) => (
            <TouchableOpacity
              key={unit.id}
              style={[
                styles.unitItem,
                {
                  backgroundColor: isDark ? 'rgba(78, 89, 104 ,0.16)' : 'rgba(78, 89, 104 ,0.16)',
                  borderColor: selectedUnit === unit.id ? colors.primary : 'transparent',
                  borderWidth: 1,
                  borderRadius: borderRadius.md,
                  paddingTop: spacing.md,
                  paddingBottom: spacing.lg,
                  paddingHorizontal: spacing.lg,
                },
              ]}
              onPress={() => handleUnitSelect(unit.id as Unit)}
            >
              <Text
                style={[
                  typography.styles.t5,
                  {
                    color: selectedUnit === unit.id ? colors.text : isDark ? colors.grey500 : colors.grey700,
                    fontWeight: selectedUnit === unit.id ? '600' : '400',
                  },
                ]}
              >
                {unit.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    gap: 12,
  },
  unitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
