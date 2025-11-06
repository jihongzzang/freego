import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/lib/theme';
import BottomSheet from '@/components/BottomSheet';
import DatePicker from '@/components/DatePicker';

interface SelectDateBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  maxHeight?: number;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onQuickSelect?: (days: number) => void;
  onConfirm: () => void;
}

export default function SelectDateBottomSheet({
  visible,
  onClose,
  title = '날짜 선택',
  maxHeight = 600,
  selectedDate,
  onDateChange,
  onConfirm,
}: SelectDateBottomSheetProps) {
  const { colors, typography } = useTheme();

  return (
    <BottomSheet maxHeight={maxHeight} visible={visible} onClose={onClose} title={title}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DatePicker value={selectedDate} onDateSelect={onDateChange} />
        <TouchableOpacity style={[styles.confirmButton, { backgroundColor: colors.primary }]} onPress={onConfirm}>
          <Text style={[typography.styles.button, { color: '#FFFFFF' }]}>확인</Text>
        </TouchableOpacity>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 20,
  },
  confirmButton: {
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
});
