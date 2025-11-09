import { StyleSheet, ScrollView, View } from 'react-native';
import { useTheme } from '@/lib/theme';
import BottomSheet from '@/components/ui/BottomSheet';
import DatePicker from '@/components/ui/DatePicker';
import { useMemo } from 'react';
import { Button } from './ui';

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
  maxHeight = 610,
  selectedDate,
  onDateChange,
  onConfirm,
}: SelectDateBottomSheetProps) {
  const { colors, spacing, isDark } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <BottomSheet maxHeight={maxHeight} visible={visible} onClose={onClose} title={title}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DatePicker value={selectedDate} onDateSelect={onDateChange} />
        <View
          style={[
            styles.confirmButtonContainer,
            {
              backgroundColor: isDark ? '#202027' : colors.white,
            },
          ]}
        >
          <Button variant="primary" size="large" onPress={onConfirm}>
            확인
          </Button>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    content: {
      gap: spacing.xl,
      paddingHorizontal: 20,
      paddingTop: 12,
    },
    confirmButtonContainer: {
      paddingVertical: spacing.xl,
    },
  });
