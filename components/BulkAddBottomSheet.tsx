import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
  const { colors, typography, borderRadius, spacing } = useTheme();

  const filteredTemplates = useMemo(() => {
    return getTemplatesByCategory(selectedCategoryId);
  }, [selectedCategoryId]);

  function isTemplateSelected(template: IngredientTemplate) {
    return selectedTemplates.some((t) => t.id === template.id);
  }

  return (
    <BottomSheet
      maxHeight={600}
      visible={visible}
      onClose={onClose}
      title="한꺼번에 등록"
    >
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
          <View style={[styles.content, { padding: spacing.md, gap: spacing.lg }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing.sm }}
            >
              {ALL_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryTab,
                    {
                      backgroundColor: selectedCategoryId === cat.id ? colors.primaryLight : colors.surface,
                      borderColor: selectedCategoryId === cat.id ? colors.primary : colors.border,
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
                      typography.styles.body,
                      {
                        color: selectedCategoryId === cat.id ? colors.primary : colors.textSecondary,
                      },
                    ]}
                  >
                    {cat.krLabel}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={[styles.templatesGrid, { gap: spacing.xs }]}>
              {filteredTemplates.map((template) => {
                const isSelected = isTemplateSelected(template);
                return (
                  <TouchableOpacity
                    key={template.id}
                    style={[
                      styles.templateItem,
                      {
                        backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                        borderColor: isSelected ? colors.primary : colors.border,
                        borderWidth: isSelected ? 2 : 1,
                        gap: spacing.xs,
                        paddingVertical: spacing.xs,
                        paddingHorizontal: spacing.sm,
                        borderRadius: borderRadius.md,
                      },
                    ]}
                    onPress={() => onTemplateToggle(template)}
                  >
                    <Text style={styles.templateEmoji}>{template.emoji}</Text>
                    <Text
                      style={[
                        typography.styles.caption,
                        {
                          color: isSelected ? colors.primary : colors.text,
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
                  borderRadius: borderRadius.md,
                },
              ]}
              onPress={onConfirm}
            >
              <Text style={[typography.styles.button, { color: '#FFFFFF' }]}>
                {selectedTemplates.length}개 추가하기
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 600,
  },
  content: {
    paddingBottom: 20,
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
    justifyContent: 'space-between',
  },
  templateItem: {
    width: '31%',
    alignItems: 'center',
    borderWidth: 1,
  },
  templateEmoji: {
    fontSize: 16,
  },
  confirmButtonContainer: {
    borderTopWidth: 1,
  },
  confirmButton: {
    alignItems: 'center',
    width: '100%',
  },
});
