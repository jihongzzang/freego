import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/lib/theme';
import BottomSheet from '@/components/ui/BottomSheet';
import { Category } from '@/data/enums/category';
import { getTemplatesByCategory, type IngredientTemplate } from '@/constants/ingredientTemplates';
import { getCategoryIcon } from '@/utils/category';
import { makeCategoryList } from '@/utils/category/makeCategoryList';
import { useMemo, useRef, useEffect } from 'react';
import { Button, Chip } from './ui';
import { useTranslation } from 'react-i18next';

interface BulkAddBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedCategoryId: Category;
  onCategoryChange: (categoryId: Category) => void;
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
  const { t, i18n } = useTranslation();
  const { colors, typography, borderRadius, spacing, isDark } = useTheme();

  const screenWidth = Dimensions.get('window').width;
  const H_PADDING = spacing.xl * 2;
  const GAP = spacing.sm;
  const ITEM_WIDTH = (screenWidth - H_PADDING - GAP * 2 - 20) / 3; // 3열 균등 분할

  const categoryScrollRef = useRef<ScrollView>(null);
  const chipRefs = useRef<{ [key: string]: View | null }>({});

  const lang = i18n.language === 'ko' ? 'kr' : 'en';
  const categories = useMemo(() => makeCategoryList({ includeAllCategory: false, lang }).slice(0, -1), [lang]);

  const filteredTemplates = useMemo(() => {
    if (selectedCategoryId === Category.ALL || selectedCategoryId === Category.OTHER) {
      return getTemplatesByCategory(Category.VEGETABLE);
    }

    return getTemplatesByCategory(selectedCategoryId);
  }, [selectedCategoryId]);

  // BottomSheet가 열릴 때 선택된 카테고리로 스크롤
  useEffect(() => {
    if (visible && categoryScrollRef.current && chipRefs.current[selectedCategoryId]) {
      // 약간의 딜레이를 주어 렌더링 완료 후 스크롤
      setTimeout(() => {
        chipRefs.current[selectedCategoryId]?.measureLayout(
          categoryScrollRef.current as any,
          (x: number) => {
            categoryScrollRef.current?.scrollTo({ x: Math.max(0, x - 20), animated: true });
          },
          () => {},
        );
      }, 100);
    }
  }, [visible, selectedCategoryId]);

  function isTemplateSelected(template: IngredientTemplate) {
    return selectedTemplates.some((t) => t.id === template.id);
  }

  return (
    <BottomSheet maxHeight={600} visible={visible} onClose={onClose} title={t('bottomSheet.bulkAdd')}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: spacing.xl, paddingTop: 12, gap: spacing.lg }}
        >
          <ScrollView
            ref={categoryScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.sm }}
          >
            {categories.map((cat) => (
              <View
                key={cat.id}
                ref={(el) => {
                  chipRefs.current[cat.id] = el;
                }}
                collapsable={false}
              >
                <Chip
                  label={cat.label}
                  onPress={() => onCategoryChange(cat.id)}
                  variant={selectedCategoryId === cat.id ? 'primary' : 'secondary'}
                  color={selectedCategoryId === cat.id ? 'green' : 'grey'}
                  size="xlarge"
                  leftIcon={cat.id !== Category.ALL && getCategoryIcon(cat.id, 16)}
                />
              </View>
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
                    {i18n.language === 'ko' ? template.krLabel : template.enLabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {selectedTemplates.length > 0 && (
          <View
            style={{
              backgroundColor: isDark ? '#202027' : colors.white,
              paddingVertical: spacing.xl,
              paddingHorizontal: spacing.xl,
            }}
          >
            <Button
              size="large"
              variant="primary"
              disabled={selectedTemplates.length > 0 ? false : true}
              onPress={onConfirm}
            >
              {t('bottomSheet.addCount', { count: selectedTemplates.length })}
            </Button>
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
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
});
