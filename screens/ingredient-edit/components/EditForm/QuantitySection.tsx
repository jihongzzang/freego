import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/theme';
import { EditFormData } from '@/mvi/features/ingredient-edit';
import { Unit } from '@/data/enums/unit';
import { getUnitLabel } from '@/utils/unit';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface QuantitySectionProps {
  quantity: string | null;
  unit: Unit | null;
  onFieldChange: (field: keyof EditFormData, value: string) => void;
  onUnitPress: () => void;
}

export function QuantitySection({ quantity, unit, onFieldChange, onUnitPress }: QuantitySectionProps) {
  const { t, i18n } = useTranslation();
  const { colors, typography, spacing, borderRadius } = useTheme();
  const lang = i18n.language === 'ko' ? 'kr' : 'en';

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={styles.row}>
      <View style={[styles.inputGroup, { flex: 1 }]}>
        <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>{t('ingredientForm.quantity')}</Text>
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
          value={quantity || ''}
          onChangeText={(text) => onFieldChange('quantity', text)}
          keyboardType="numeric"
          placeholder={t('ingredientForm.quantityPlaceholder')}
          placeholderTextColor={colors.textTertiary}
        />
      </View>
      <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
        <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>{t('ingredientForm.unit')}</Text>
        <TouchableOpacity
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          ]}
          onPress={onUnitPress}
        >
          <Text
            style={[
              typography.styles.t6,
              {
                color: unit ? colors.text : colors.textTertiary,
              },
            ]}
          >
            {unit ? getUnitLabel({ unit, lang }) : t('ingredientForm.unitPlaceholder')}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
    },
    inputGroup: {
      gap: spacing.sm,
    },
    input: {
      paddingHorizontal: spacing.lg,
      paddingVertical: 14,
      borderWidth: 1,
    },
  });
