import Accordion from '@/components/ui/Accordion';
import Card from '@/components/ui/Card';
import EmptyStateUI from '@/components/ui/EmptyState';
import { Ingredient } from '@/mvi/features/ingredients';
import { getCategoryIcon } from '@/utils/getCategoryIcons';
import { findCategoryById, CategoryType } from '@/constants/categories';
import { IngredientItem } from './IngredientItem';
import { useTheme } from '@/lib/theme';
import { Text } from 'react-native';

interface CategoryAccordionProps {
  categoryId: CategoryType;
  items: Ingredient[];
  isExpanded: boolean;
  onToggle: () => void;
  onItemPress: (id: string) => void;
  onItemEdit: (id: string) => void;
  onQuickDeduct: (id: string) => void;
  getDaysRemaining: (daysRemaining: number | null) => string;
}

export function CategoryAccordion({
  categoryId,
  items,
  isExpanded,
  onToggle,
  onItemPress,
  onItemEdit,
  onQuickDeduct,
  getDaysRemaining,
}: CategoryAccordionProps) {
  const categoryItem = findCategoryById(categoryId);

  const { colors, typography } = useTheme();

  return (
    <Accordion
      title={categoryItem?.krLabel || ''}
      leftIcon={getCategoryIcon(categoryId, 20)}
      badge={
        items.length > 0 ? (
          <Text style={[typography.styles.t7Bold, { color: colors.grey500 }]}>{items.length}</Text>
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
              onPress={() => onItemPress(item.id)}
              onEdit={() => onItemEdit(item.id)}
              onQuickDeduct={() => onQuickDeduct(item.id)}
              getDaysRemaining={getDaysRemaining}
            />
          ))}
        </Card>
      ) : (
        <EmptyStateUI title="재료가 없어요" />
      )}
    </Accordion>
  );
}
