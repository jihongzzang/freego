import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '@/lib/theme';
import BottomSheet from '@/components/ui/BottomSheet';
import { Button } from './ui';

interface EditMemoBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  memo: string;
  onMemoChange: (text: string) => void;
  onSubmit: () => void;
}

export default function EditMemoBottomSheet({
  visible,
  onClose,
  memo,
  onMemoChange,
  onSubmit,
}: EditMemoBottomSheetProps) {
  const { colors, typography, isDark, spacing } = useTheme();

  return (
    <BottomSheet maxHeight={360} visible={visible} onClose={onClose} title={memo ? '메모 수정' : '메모 추가'}>
      <View style={styles.container}>
        <View style={styles.content}>
          <TextInput
            style={[
              styles.input,
              typography.styles.t5,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={memo}
            onChangeText={onMemoChange}
            placeholder="메모를 입력하세요"
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            autoFocus
          />
        </View>

        <View
          style={[
            styles.confirmButtonContainer,
            {
              backgroundColor: isDark ? '#202027' : colors.white,
              paddingVertical: spacing.xl,
              paddingHorizontal: spacing.xl,
            },
          ]}
        >
          <Button size="large" variant="primary" onPress={onSubmit}>
            저장
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  content: {
    paddingHorizontal: 20,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    minHeight: 170,
  },
  confirmButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
