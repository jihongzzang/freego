import { View, StyleSheet } from 'react-native';
import { AddFormData } from '@/mvi/features/add';
import { type IngredientTemplate } from '@/constants/ingredientTemplates';
import { BasicInfoSection } from '../../ingredient-detail/components/EditForm/BasicInfoSection';
import { CategorySection } from '../../ingredient-detail/components/EditForm/CategorySection';
import { QuantitySection } from '../../ingredient-detail/components/EditForm/QuantitySection';
import { DateSection } from '../../ingredient-detail/components/EditForm/DateSection';
import { StorageSection } from '../../ingredient-detail/components/EditForm/StorageSection';
import { MemoSection } from '@/screens/ingredient-detail/components/EditForm/MemoSection';

interface AddFormProps {
  formData: AddFormData;
  errors: Partial<Record<keyof AddFormData, string>>;
  selectedEmoji: IngredientTemplate | null;
  onFieldChange: (field: keyof AddFormData, value: string) => void;
  onEmojiPress: () => void;
  onUnitPress: () => void;
  onPurchaseDatePress: () => void;
  onExpiryDatePress: () => void;
  onQuickSelect: (days: number) => void;
}

export function AddForm({
  formData,
  errors,
  selectedEmoji,
  onFieldChange,
  onEmojiPress,
  onUnitPress,
  onPurchaseDatePress,
  onExpiryDatePress,
  onQuickSelect,
}: AddFormProps) {
  return (
    <View style={styles.container}>
      <CategorySection selectedCategory={formData.category} onCategoryChange={onFieldChange as any} />

      <BasicInfoSection
        formData={formData as any}
        selectedEmoji={selectedEmoji}
        onFieldChange={onFieldChange as any}
        onEmojiPress={onEmojiPress}
      />

      <StorageSection storageLocation={formData.storage_location || ''} onFieldChange={onFieldChange as any} />

      <DateSection
        purchaseDate={formData.purchase_date || ''}
        expiryDate={formData.expiry_date || ''}
        onFieldChange={onFieldChange as any}
        onPurchaseDatePress={onPurchaseDatePress}
        onExpiryDatePress={onExpiryDatePress}
        onQuickSelect={onQuickSelect}
      />

      <QuantitySection
        quantity={formData.quantity}
        unit={formData.unit}
        onFieldChange={onFieldChange as any}
        onUnitPress={onUnitPress}
      />

      <MemoSection memo={formData.memo || ''} onFieldChange={onFieldChange as any} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
});
