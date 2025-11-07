import Accordion from '@/components/ui/Accordion';
import Card from '@/components/ui/Card';
import EmptyStateUI from '@/components/ui/EmptyState';
import { Ingredient } from '@/mvi/features/ingredients';
import { getStorageLocationIcon } from '@/utils/getStorageLocationIcons';
import { findStorageLocationById, StorageLocationType } from '@/constants/storageLocations';
import { IngredientItem } from './IngredientItem';
import { useTheme } from '@/lib/theme';
import { Text } from 'react-native';

interface StorageAccordionProps {
  storageId: StorageLocationType;
  items: Ingredient[];
  isExpanded: boolean;
  onToggle: () => void;
  onItemPress: (id: string) => void;
  onItemEdit: (id: string) => void;
  onQuickDeduct: (id: string) => void;
  getDaysRemaining: (daysRemaining: number | null) => string;
}

export function StorageAccordion({
  storageId,
  items,
  isExpanded,
  onToggle,
  onItemPress,
  onItemEdit,
  onQuickDeduct,
  getDaysRemaining,
}: StorageAccordionProps) {
  const { colors, typography } = useTheme();

  const storageItem = findStorageLocationById(storageId);

  return (
    <Accordion
      title={storageItem?.krLabel || ''}
      leftIcon={getStorageLocationIcon(storageId, 20)}
      badge={
        items.length > 0 ? (
          <Text style={[typography.styles.t7Bold, { color: colors.text }]}>{items.length}</Text>
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
