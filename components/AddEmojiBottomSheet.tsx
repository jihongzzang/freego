import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/lib/theme';
import BottomSheet from '@/components/ui/BottomSheet';
import { Category } from '@/data/enums/category';
import { getTemplatesByCategory, type IngredientTemplate } from '@/constants/ingredientTemplates';
import { useMemo } from 'react';

interface AddEmojiBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedCategoryId: Category;
  selectedTemplates: IngredientTemplate[];
  onTemplateToggle: (template: IngredientTemplate) => void;
}

export default function AddEmojiBottomSheet({
  visible,
  onClose,
  selectedCategoryId,
  selectedTemplates,
  onTemplateToggle,
}: AddEmojiBottomSheetProps) {
  const { colors, typography, borderRadius, spacing, isDark } = useTheme();

  // ✅ 화면 너비 기반으로 균등 3열 계산
  const screenWidth = Dimensions.get('window').width;
  const H_PADDING = spacing.xl * 2; // ScrollView padding 좌우 합
  const GAP = spacing.sm; // 아이템 간 동일 간격
  const ITEM_WIDTH = (screenWidth - H_PADDING - GAP * 2 - 20) / 3; // 3열 균등 분할

  const filteredTemplates = useMemo(() => {
    return getTemplatesByCategory(selectedCategoryId);
  }, [selectedCategoryId]);

  function isTemplateSelected(template: IngredientTemplate) {
    return selectedTemplates.some((t) => t.id === template.id);
  }

  return (
    <BottomSheet maxHeight={600} visible={visible} onClose={onClose} title="이모지 추가">
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: spacing.xl, paddingTop: 12 }}
        >
          <View style={styles.templatesGrid}>
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
                      backgroundColor: isDark ? 'rgba(78, 89, 104 ,0.16)' : 'rgba(78, 89, 104 ,0.16)',
                      borderColor: isSelected ? colors.primary : 'transparent',
                      borderWidth: 1,
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
                        color: isSelected ? colors.text : isDark ? colors.grey500 : colors.grey700,
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
      </View>
    </BottomSheet>
  );
}

// 🎨 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  templateItem: {
    alignItems: 'center',
  },
  templateEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
});
