import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/theme';
import { EditFormData } from '@/mvi/features/ingredient-detail';
import { QUICK_SELECT_OPTIONS } from '@/constants/quickSelectOptions';

interface DateSectionProps {
  purchaseDate: string;
  expiryDate: string;
  onFieldChange: (field: keyof EditFormData, value: string) => void;
  onPurchaseDatePress: () => void;
  onExpiryDatePress: () => void;
  onQuickSelect: (days: number) => void;
}

export function DateSection({
  purchaseDate,
  expiryDate,
  onFieldChange,
  onPurchaseDatePress,
  onExpiryDatePress,
  onQuickSelect,
}: DateSectionProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      {/* 구매일 */}
      <View style={styles.container}>
        <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>구매일</Text>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => {
              if (purchaseDate) {
                onFieldChange('purchase_date', '');
              } else {
                onFieldChange('purchase_date', today);
              }
            }}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: purchaseDate === today ? colors.primary : colors.border,
                  backgroundColor: purchaseDate === today ? colors.primary : 'transparent',
                },
              ]}
            >
              {purchaseDate === today && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
            <Text style={[typography.styles.t7, { color: colors.textTertiary }]}>등록일과 동일</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.dateButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
            },
          ]}
          onPress={onPurchaseDatePress}
        >
          <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
          <Text
            style={[
              typography.styles.t6,
              {
                color: purchaseDate ? colors.text : colors.textTertiary,
              },
            ]}
          >
            {purchaseDate || '날짜 선택'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 유통기한 */}
      <View style={styles.container}>
        <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>유통기한</Text>

        <View style={styles.quickSelectContainer}>
          {QUICK_SELECT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.quickSelectBtn,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}
              onPress={() => onQuickSelect(option.days)}
            >
              <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>{option.krLabel}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.dateButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
            },
          ]}
          onPress={onExpiryDatePress}
        >
          <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
          <Text
            style={[
              typography.styles.t6,
              {
                color: expiryDate ? colors.text : colors.textTertiary,
              },
            ]}
          >
            {expiryDate || '날짜 선택'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  quickSelectContainer: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  quickSelectBtn: {
    flex: 1,
    minWidth: '22%',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
});
