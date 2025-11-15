import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '@/lib/theme';
import BottomSheet from '@/components/ui/BottomSheet';
import { makeCategoryList } from '@/utils/category/makeCategoryList';
import { getCategoryIcon } from '@/utils/category';
import { useMemo } from 'react';
import { Button, Chip } from './ui';
import { Category } from '@/data/enums/category';

interface AddShoppingListBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  name: string;
  category: Category;
  memo: string;
  onNameChange: (text: string) => void;
  onCategoryChange: (categoryId: Category) => void;
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
  const { colors, typography, isDark, spacing } = useTheme();
  const categories = useMemo(() => makeCategoryList({ lang: 'kr' }), []);

  return (
    <BottomSheet maxHeight={550} visible={visible} onClose={onClose} title="장보기 항목 추가">
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.inputGroup}>
              <Text style={[typography.styles.t5Semibold, { color: colors.textSecondary }]}>재료 이름</Text>
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
              <Text style={[typography.styles.t5Semibold, { color: colors.textSecondary }]}>카테고리</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {categories.map((cat) => (
                  <Chip
                    key={cat.id}
                    label={cat.label}
                    onPress={() => onCategoryChange(cat.id)}
                    variant={category === cat.id ? 'primary' : 'secondary'}
                    color={category === cat.id ? 'green' : 'grey'}
                    size="xlarge"
                    leftIcon={cat.id !== Category.ALL && getCategoryIcon(cat.id, 16)}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[typography.styles.t5Semibold, { color: colors.textSecondary }]}>메모 (선택)</Text>
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
          style={{
            backgroundColor: isDark ? '#202027' : colors.white,
            paddingVertical: spacing.xl,
            paddingHorizontal: spacing.xl,
          }}
        >
          <Button size="large" variant="primary" onPress={onSubmit} disabled={!name.trim()}>
            추가
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 550,
  },
  content: {
    padding: 20,
    gap: 20,
    paddingTop: 12,
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
