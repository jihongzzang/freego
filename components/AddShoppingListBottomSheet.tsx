import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '@/lib/theme';
import BottomSheet from '@/components/BottomSheet';
import { getCategoryIcon } from '@/utils/getCategoryIcons';
import { CATEGORIES } from '@/constants/categories';

interface AddShoppingListBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  name: string;
  category: string;
  memo: string;
  onNameChange: (text: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onMemoChange: (text: string) => void;
  onSubmit: () => void;
}

export default function AddShoppingListBottomSheet({
  visible,
  onClose,
  name,
  category,
  memo,
  onNameChange,
  onCategoryChange,
  onMemoChange,
  onSubmit,
}: AddShoppingListBottomSheetProps) {
  const { colors, typography, isDark } = useTheme();

  return (
    <BottomSheet maxHeight={550} visible={visible} onClose={onClose} title="장보기 항목 추가">
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.inputGroup}>
              <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>재료 이름</Text>
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
                value={name}
                onChangeText={onNameChange}
                placeholder="예: 양파, 당근"
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>카테고리</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      {
                        // backgroundColor: colors.surface,
                        // borderColor: colors.border,
                        backgroundColor: isDark ? colors.grey400 : colors.grey200,
                        borderColor: isDark ? colors.grey400 : colors.grey200,
                      },
                      category === cat.id && {
                        // backgroundColor: colors.primaryLight,
                        // borderColor: colors.primary,
                        backgroundColor: isDark ? colors.grey600 : colors.grey400,
                        borderColor: isDark ? colors.grey600 : colors.grey400,
                      },
                    ]}
                    onPress={() => onCategoryChange(cat.id)}
                  >
                    <View style={styles.categoryChipContent}>
                      {getCategoryIcon(cat.id, 16)}
                      <Text
                        style={[
                          typography.styles.t6,
                          { color: colors.grey700 },
                          category === cat.id && {
                            color: isDark ? colors.text : colors.white,
                          },
                        ]}
                      >
                        {cat.krLabel}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>메모 (선택)</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.memoInput,
                  typography.styles.t5,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                value={memo}
                onChangeText={onMemoChange}
                placeholder="예: 1kg, 신선한 것으로"
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

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
                backgroundColor: name.trim() ? colors.primary : colors.border,
              },
            ]}
            onPress={onSubmit}
            disabled={!name.trim()}
          >
            <Text
              style={[
                typography.styles.st8Semibold,
                {
                  color: name.trim() ? '#FFFFFF' : colors.textTertiary,
                },
              ]}
            >
              추가
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
    maxHeight: 472,
  },
  content: {
    padding: 20,
    gap: 20,
    paddingBottom: 20,
  },
  inputGroup: {
    gap: 8,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  memoInput: {
    minHeight: 80,
    paddingTop: 14,
  },
  categoryScroll: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
