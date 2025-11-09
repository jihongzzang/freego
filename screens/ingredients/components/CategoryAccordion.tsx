import Accordion from '@/components/ui/Accordion';
import Card from '@/components/ui/Card';
import EmptyStateUI from '@/components/ui/EmptyState';
import { Ingredient } from '@/mvi/features/ingredients';
import { Category } from '@/data/enums/category';
import { getCategoryIcon, getCategoryLabel } from '@/utils/category';
import { IngredientItem } from './IngredientItem';
import { useTheme } from '@/lib/theme';
import { Text } from 'react-native';

interface CategoryAccordionProps {
  categoryId: Category;
  items: Ingredient[];
  isExpanded: boolean;
  onToggle: () => void;
  onItemPress: (id: string) => void;
  onItemEdit: (id: string) => void;
  onQuickDeduct: (id: string) => void;
  onQuickDelete: (id: string) => void;
}

export function CategoryAccordion({
  categoryId,
  items,
  isExpanded,
  onToggle,
  onItemPress,
  onItemEdit,
  onQuickDeduct,
  onQuickDelete,
}: CategoryAccordionProps) {
  const { colors, typography } = useTheme();

  return (
    <Accordion
      title={getCategoryLabel({ category: categoryId, lang: 'kr' })}
      leftIcon={getCategoryIcon(categoryId, 20)}
      badge={
        items.length > 0 ? (
          <Text style={[typography.styles.t7Bold, { color: colors.textSecondary }]}>{items.length}</Text>
        ) : undefined
      }
      defaultExpanded={isExpanded}
      onToggle={onToggle}
    >
      {items.length > 0 ? (
        <Card variant="elevated" padding="none">
          {items.map((item) => (
            <IngredientItem
              key={item.id}
              item={item}
              onPress={() => onItemPress(String(item.id))}
              onEdit={() => onItemEdit(String(item.id))}
              onQuickDeduct={() => onQuickDeduct(String(item.id))}
              onQuickDelete={() => onQuickDelete(String(item.id))}
            />
          ))}
        </Card>
      ) : (
        <EmptyStateUI title="재료가 없어요" />
      )}
    </Accordion>
  );
}
