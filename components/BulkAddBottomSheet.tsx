import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/lib/theme';
import BottomSheet from '@/components/BottomSheet';
import { ALL_CATEGORIES, ALL_CATEGORY, AllCategoryType } from '@/constants/categories';
import { getTemplatesByCategory, type IngredientTemplate } from '@/constants/ingredientTemplates';
import { getCategoryIcon } from '@/utils/getCategoryIcons';
import { useMemo } from 'react';

interface BulkAddBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedCategoryId: AllCategoryType;
  onCategoryChange: (categoryId: AllCategoryType) => void;
  selectedTemplates: IngredientTemplate[];
  onTemplateToggle: (template: IngredientTemplate) => void;
  onConfirm: () => void;
}

export default function BulkAddBottomSheet({
  visible,
  onClose,
  selectedCategoryId,
  onCategoryChange,
  selectedTemplates,
  onTemplateToggle,
  onConfirm,
}: BulkAddBottomSheetProps) {
  const { colors, typography, borderRadius, spacing, isDark } = useTheme();

  const screenWidth = Dimensions.get('window').width;
  const H_PADDING = spacing.md * 2;
  const GAP = spacing.sm;
  const ITEM_WIDTH = (screenWidth - H_PADDING - GAP * 2 - 24) / 3; // 3열 균등 분할

  const filteredTemplates = useMemo(() => {
    return getTemplatesByCategory(selectedCategoryId);
  }, [selectedCategoryId]);

  function isTemplateSelected(template: IngredientTemplate) {
    return selectedTemplates.some((t) => t.id === template.id);
  }

  return (
    <BottomSheet maxHeight={600} visible={visible} onClose={onClose} title="한꺼번에 등록">
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: spacing.md, gap: spacing.lg }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
            {ALL_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryTab,
                  {
                    backgroundColor:
                      selectedCategoryId === cat.id
                        ? isDark
                          ? colors.grey600
                          : colors.grey400
                        : isDark
                          ? colors.grey400
                          : colors.grey200,
                    borderColor:
                      selectedCategoryId === cat.id
                        ? isDark
                          ? colors.grey600
                          : colors.grey400
                        : isDark
                          ? colors.grey400
                          : colors.grey200,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs + 2,
                    borderRadius: borderRadius.xl,
                  },
                ]}
                onPress={() => onCategoryChange(cat.id)}
              >
                {cat.id !== ALL_CATEGORY.id && getCategoryIcon(cat.id, 16)}
                <Text
                  style={[
                    typography.styles.t6,
                    {
                      color: selectedCategoryId === cat.id ? (isDark ? colors.text : colors.white) : colors.grey700,
                    },
                  ]}
                >
                  {cat.krLabel}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={[styles.templatesGrid]}>
            {filteredTemplates.map((template) => {
              const isSelected = isTemplateSelected(template);
              return (
                <TouchableOpacity
                  key={template.id}
                  style={[
                    styles.templateItem,
                    {
                      width: ITEM_WIDTH,
                      marginBottom: GAP,
                      backgroundColor: colors.surface,
                      borderColor: isSelected ? (isDark ? colors.grey300 : colors.grey700) : colors.border,
                      borderWidth: isSelected ? 1 : 1,
                      borderRadius: borderRadius.md,
                      paddingVertical: spacing.sm,
                      paddingHorizontal: spacing.sm,
                    },
                  ]}
                  onPress={() => onTemplateToggle(template)}
                >
                  <Text style={styles.templateEmoji}>{template.emoji}</Text>
                  <Text
                    style={[
                      typography.styles.t7,
                      {
                        color: isSelected
                          ? isDark
                            ? colors.white
                            : colors.text
                          : isDark
                            ? colors.grey300
                            : colors.grey600,
                        fontWeight: isSelected ? '600' : '400',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {template.krLabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {selectedTemplates.length > 0 && (
          <View
            style={[
              styles.confirmButtonContainer,
              {
                backgroundColor: colors.background,
                borderTopColor: colors.border,
                paddingHorizontal: spacing.xl,
                paddingVertical: spacing.md,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.confirmButton,
                {
                  backgroundColor: colors.primary,
                  paddingVertical: spacing.lg,
                  borderRadius: borderRadius.xl,
                },
              ]}
              onPress={onConfirm}
            >
              <Text style={[typography.styles.st8Semibold, { color: '#FFFFFF' }]}>
                {selectedTemplates.length}개 추가하기
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </BottomSheet>
  );
}

// 🎨 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 600,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // ✅ 가로 간격 균등
  },
  templateItem: {
    alignItems: 'center',
  },
  templateEmoji: {
    fontSize: 16,
    marginBottom: 4,
  },
  confirmButtonContainer: {
    borderTopWidth: 1,
  },
  confirmButton: {
    alignItems: 'center',
    width: '100%',
  },
});
