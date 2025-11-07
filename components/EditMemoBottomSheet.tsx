import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '@/lib/theme';
import BottomSheet from '@/components/BottomSheet';

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
  const { colors, typography } = useTheme();

  return (
    <BottomSheet maxHeight={350} visible={visible} onClose={onClose} title={memo ? '메모 수정' : '메모 추가'}>
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
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.confirmButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={onSubmit}
          >
            <Text
              style={[
                typography.styles.st8Semibold,
                {
                  color: '#FFFFFF',
                },
              ]}
            >
              저장
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 272,
  },
  content: {
    padding: 20,
    paddingBottom: 20,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    minHeight: 120,
  },
  confirmButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  confirmButton: {
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
  },
});
