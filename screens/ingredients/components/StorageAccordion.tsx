import Accordion from '@/components/ui/Accordion';
import Card from '@/components/ui/Card';
import EmptyStateUI from '@/components/ui/EmptyState';
import { Ingredient } from '@/mvi/features/ingredients';
import { StorageLocation } from '@/data/enums/storage_location';
import { getStorageLocationIcon, getStorageLocationLabel } from '@/utils/storageLocation';
import { IngredientItem } from './IngredientItem';
import { useTheme } from '@/lib/theme';
import { Text } from 'react-native';
import { HelpCircle } from 'lucide-react-native';

interface StorageAccordionProps {
  storageId: StorageLocation | 'unset';
  items: Ingredient[];
  isExpanded: boolean;
  onToggle: () => void;
  onItemPress: (id: string) => void;
  onItemEdit: (id: string) => void;
  onQuickDeduct: (id: string) => void;
}

export function StorageAccordion({
  storageId,
  items,
  isExpanded,
  onToggle,
  onItemPress,
  onItemEdit,
  onQuickDeduct,
}: StorageAccordionProps) {
  const { colors, typography } = useTheme();

  const storageLabel =
    storageId === 'unset' ? '미설정' : getStorageLocationLabel({ storageLocation: storageId, lang: 'kr' });
  const storageIcon =
    storageId === 'unset' ? (
      <HelpCircle size={20} color={colors.textSecondary} />
    ) : (
      getStorageLocationIcon(storageId, 20)
    );

  return (
    <Accordion
      title={storageLabel}
      leftIcon={storageIcon}
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
            />
          ))}
        </Card>
      ) : (
        <EmptyStateUI title="재료가 없어요" />
      )}
    </Accordion>
  );
}
