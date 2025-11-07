import { View, StyleSheet } from 'react-native';
import { EditFormData } from '@/mvi/features/ingredient-detail';
import { type IngredientTemplate } from '@/constants/ingredientTemplates';
import { BasicInfoSection } from './BasicInfoSection';
import { CategorySection } from './CategorySection';
import { QuantitySection } from './QuantitySection';
import { DateSection } from './DateSection';
import { StorageAndMemoSection } from './StorageAndMemoSection';

interface EditFormProps {
  formData: EditFormData;
  selectedEmoji: IngredientTemplate | null;
  onFieldChange: (field: keyof EditFormData, value: string) => void;
  onEmojiPress: () => void;
  onUnitPress: () => void;
  onPurchaseDatePress: () => void;
  onExpiryDatePress: () => void;
  onQuickSelect: (days: number) => void;
}

export function EditForm({
  formData,
  selectedEmoji,
  onFieldChange,
  onEmojiPress,
  onUnitPress,
  onPurchaseDatePress,
  onExpiryDatePress,
  onQuickSelect,
}: EditFormProps) {
  return (
    <View style={styles.container}>
      <BasicInfoSection
        formData={formData}
        selectedEmoji={selectedEmoji}
        onFieldChange={onFieldChange}
        onEmojiPress={onEmojiPress}
      />

      <CategorySection selectedCategory={formData.category} onCategoryChange={onFieldChange} />

      <QuantitySection
        quantity={formData.quantity}
        unit={formData.unit}
        onFieldChange={onFieldChange}
        onUnitPress={onUnitPress}
      />

      <DateSection
        purchaseDate={formData.purchase_date || ''}
        expiryDate={formData.expiry_date || ''}
        onFieldChange={onFieldChange}
        onPurchaseDatePress={onPurchaseDatePress}
        onExpiryDatePress={onExpiryDatePress}
        onQuickSelect={onQuickSelect}
      />

      <StorageAndMemoSection
        storageLocation={formData.storage_location}
        memo={formData.memo || ''}
        onFieldChange={onFieldChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
});
