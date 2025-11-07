import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/theme';
import BottomSheet from '@/components/BottomSheet';
import { UNITS, UnitType } from '@/constants/units';

interface SelectUnitBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedUnit?: UnitType;
  onUnitSelect: (unitId: string) => void;
}

export default function SelectUnitBottomSheet({
  visible,
  onClose,
  selectedUnit,
  onUnitSelect,
}: SelectUnitBottomSheetProps) {
  const { colors, typography, spacing, borderRadius, isDark } = useTheme();

  const handleUnitSelect = (unitId: string) => {
    onUnitSelect(unitId);
    onClose();
  };

  return (
    <BottomSheet maxHeight={400} visible={visible} onClose={onClose} title="단위 선택">
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { padding: spacing.md, gap: spacing.xs }]}
        >
          {UNITS.map((unit) => (
            <TouchableOpacity
              key={unit.id}
              style={[
                styles.unitItem,
                {
                  backgroundColor: selectedUnit === unit.id ? (isDark ? colors.white : colors.grey400) : colors.surface,
                  borderColor: selectedUnit === unit.id ? (isDark ? colors.white : colors.grey400) : colors.border,
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md,
                  borderRadius: borderRadius.md,
                },
              ]}
              onPress={() => handleUnitSelect(unit.id)}
            >
              <Text
                style={[
                  typography.styles.t5Medium,
                  {
                    color: selectedUnit === unit.id ? (isDark ? colors.black : colors.white) : colors.text,
                  },
                ]}
              >
                {unit.krLabel}
              </Text>
              {selectedUnit === unit.id && (
                <Ionicons name="checkmark" size={24} color={isDark ? colors.black : colors.white} />
              )}
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
    maxHeight: 400,
  },
  content: {
    // padding� gap@ x|x ��|\ �
  },
  unitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
});
